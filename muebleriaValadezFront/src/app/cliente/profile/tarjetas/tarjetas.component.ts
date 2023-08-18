import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core'; // Importa OnInit
import axios from 'axios';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa FormGroup y FormControl
@Component({
  selector: 'app-tarjetas', // El selector debe coincidir con el que estás utilizando en la plantilla
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.css']
})
export class TarjetasComponent implements OnInit {
  // ... código del componente ...
  tarjetaForm!: FormGroup; // Agrega el operador de inicialización '!' al final del tipo
  // @Input() tarjetas: any[] = [];
  @Input() id: any;
  constructor(private formBuilder: FormBuilder) {
    this.initForm();
  }
  tarjeta: any = [];
  edit = false;
  numbertarjeta: string = "";
  expiration: string = "";
  cvv: string = "";
  name: string = "";
  user: any;
  cliente: any;
  initForm(): void {
    this.tarjetaForm = this.formBuilder.group({
      cardName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      cardExpiry: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$')]],
      cardCVC: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
    });
  }

  async ngOnInit() {
    this.initForm();

    this.user = sessionStorage.getItem("idUsuario");
    this.cliente = sessionStorage.getItem("idCliente");
    //consultar tarjetas del usuario

    //obtener usuario

    //let user = sessionStorage.getItem("user");
    //this.user = sessionStorage.getItem("user");

    Swal.fire({
      title: 'Cargando',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    //https://localhost:7010/user/User/GetTarjeta?id=0
    await axios.post("https://localhost:7010/api/Tarjeta/GetTarjeta?id=" + this.id).then((res) => {
      this.edit = true;
      this.tarjeta = res.data.data;
      this.numbertarjeta = this.tarjeta[0].numeroTarejta;
      this.expiration = this.tarjeta[0].vencimiento;
      this.cvv = this.tarjeta[0].cvv;
      this.name = this.tarjeta[0].nombreTitular;



      let cardNumber = <HTMLInputElement>document.getElementById("cardNumber");
      let expiration = <HTMLInputElement>document.getElementById("expiration");
      let cvv = <HTMLInputElement>document.getElementById("CSV");
      let name = <HTMLInputElement>document.getElementById("cardName");

      cardNumber.value = this.numbertarjeta;
      expiration.value = this.expiration;
      cvv.value = this.cvv;
      name.value = this.name;





    }

    ).catch((error) => {
      console.log(error);
    }

    );

    Swal.close();


  }

  validateNumber() {
    let expiration = <HTMLInputElement>document.getElementById("expiration");

    //validar que no tenga otro caracter que no sea numero o /
    let valor = expiration.value;
    let ultimoCaracter = valor.substr(valor.length - 1);
    if (isNaN(Number(ultimoCaracter)) && ultimoCaracter != "/") {
      expiration.value = valor.substr(0, valor.length - 1);
    }



    if (expiration.value.length == 2) {
      expiration.value = expiration.value + "/";



    }

    this.expiration = expiration.value;

  }


  validateNumberCard() {
    let cardNumber = <HTMLInputElement>document.getElementById("cardNumber");

    //validar que no tenga otro caracter que no sea numero o /
    let valor = cardNumber.value;
    let ultimoCaracter = valor.substr(valor.length - 1);
    if (isNaN(Number(ultimoCaracter))) {
      cardNumber.value = valor.substr(0, valor.length - 1);
    }



    if (cardNumber.value.length == 4 || cardNumber.value.length == 9 || cardNumber.value.length == 14) {
      cardNumber.value = cardNumber.value + " ";

    }

    this.numbertarjeta = cardNumber.value;

  }

  validateName() {

    let name = <HTMLInputElement>document.getElementById("cardName");


    this.name = name.value;

  }

  validateNumberCv() {

    let cvv = <HTMLInputElement>document.getElementById("CSV");


    this.cvv = cvv.value;


  }


  onSubmit() {
    /*{
   "idCliente": 0,
   "tipo": "string",
   "numeroTarejta": 0,
   "nombreTitular": "string",
   "vencimiento": "string",
   "cvv": 0
 }*/

    let number = this.numbertarjeta.replace(/\s/g, "");

    let number2 = parseInt(number);

    let cvv2 = parseInt(this.cvv);

    let data = {
      "idCliente": this.cliente,
      "tipo": "1",
      "numeroTarejta": number2,
      "nombreTitular": this.name,
      "vencimiento": this.expiration,
      "cvv": cvv2,
      "idUsuario": this.user,

    }

    axios.post("https://localhost:7010/api/Tarjeta/CrearTarjeta?idUsuariob=" + this.user, data).then((res) => {
      Swal.fire(
        'Guardado',
        'La tarjeta ha sido guardada.',
        'success'
      )
      //http://localhost:4200/profile?page=3

      window.location.href = "/profile?page=1";
    }

    ).catch((error) => {

      Swal.fire(
        'Error',
        'La tarjeta no ha sido guardada.',
        'error'
      )
      console.log(error);
    }


    );






  }



  drop(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      console.log(result);
      if (result.isConfirmed) {

        console.log("eliminar");

        let data = {
          "idUsuario": this.user,
          "idCliente": this.cliente
        }


        axios.post("https://localhost:7010/api/Tarjeta/EliminarTarjeta?id=" + id + "&idUsuariob=" + this.user, data).then((res) => {
          Swal.fire(
            'Eliminado',
            'La tarjeta ha sido eliminada.',
            'success'
          )
         // window.location.reload();
          window.location.href = "/profile?page=1";
        }

        ).catch((error) => {
          console.log(error);
        }

        );

      }


    })


  }

}


