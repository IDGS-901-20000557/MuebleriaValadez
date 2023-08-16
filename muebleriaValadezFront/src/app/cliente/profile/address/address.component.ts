import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core'; // Importa OnInit
import axios from 'axios';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa FormGroup y FormControl

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  // ... código del componente ...
  addressForm!: FormGroup; // Agrega el operador de inicialización '!' al final del tipo
  // @Input() tarjetas: any[] = [];
  @Input() id: any;
  constructor(private formBuilder: FormBuilder) {
    this.initForm();
  }
  /*    calle,noExt,noInt, IdDomicilio, cp, colonia, ciudad, estado */
  //direcciones: any = [];
  colonias: any = [];
  ciudades: any = [];
  estados: any = [];
  cps: any = [];

  edit = false;
  calle: string = "";
  noExt: string = "";
  noInt: string = "";
  IdDomicilio: string = "";
  cp: string = "";
  colonia: string = "";
  ciudad: string = "";
  estado: string = "";
  cliente: any;
  user: any;

  
  initForm(): void {
    this.addressForm = this.formBuilder.group({
      calle: ['', Validators.required],
      noExt: ['', Validators.required],
      noInt: ['', Validators.required],
      IdDomicilio: ['', Validators.required],
      cp: ['', Validators.required],
      colonia: ['', Validators.required],
      ciudad: ['', Validators.required],
      estado: ['', Validators.required]
    });


  }

  async ngOnInit() {
    this.initForm();

    this.user = sessionStorage.getItem("idUsuario");
    this.cliente = sessionStorage.getItem("idCliente");

    //consultar colonias 
    await this.getEstados();

    //https://localhost:7010/Address/Address/getAdressbyid?idDireccion=

    const response = await axios.get("https://localhost:7010/api/Direccion/getAdressbyid?idDireccion=" + this.id);
    const res = response;

    //obtener los inputs 

    let calle = (<HTMLInputElement>document.getElementById("calle"));
    let noExt = (<HTMLInputElement>document.getElementById("noExt"));
    let noInt = (<HTMLInputElement>document.getElementById("noInt"));
    let cp = (<HTMLInputElement>document.getElementById("cp"));
    let colonia = (<HTMLInputElement>document.getElementById("colonia"));
    let ciudad = (<HTMLInputElement>document.getElementById("ciudad"));
    let estado = (<HTMLInputElement>document.getElementById("estado"));


    this.edit = true;
    calle.value = res.data[0].calle;
    noExt.value = res.data[0].noExt;
    noInt.value = res.data[0].noInt;
    estado.value = res.data[0].domicilio.estado;

    const response2 = await axios.get("https://localhost:7010/api/Direccion/getCiudades?estado=" + res.data[0].domicilio.estado);

    this.ciudades = await response2.data;

    const response3 = await axios.get("https://localhost:7010/api/Direccion/getCp?ciudad=" + res.data[0].domicilio.ciudad);
    this.cps = await response3.data;

    const response4 = await axios.get("https://localhost:7010/api/Direccion/getColonia?cp=" + res.data[0].domicilio.cp);
    this.colonias = await response4.data;


    const response5 = await axios.get("https://localhost:7010/api/Direccion/getAdressbyid?idDireccion=" + this.id);
    const res5 = response;


    ciudad.value = res.data[0].domicilio.ciudad;

    cp.value = res.data[0].domicilio.cp;

    colonia.value = res.data[0].domicilio.idDomicilio;



  }


  onSubmit() {

    /*https://localhost:7010/Address/Address/addAddress
  
    {
    "calle": "",
    "noExt": 0,
    "noInt": 0,
    "idDomicilio": 0
  }
    
    
    */

    //let cliente = sessionStorage.getItem("idCliente");


    //checar cual de los dos es
   // if (cliente != null && cliente != "") {
    //  this.user = cliente;

   // }
    //else {
     // this.user = 1;
   // }


    let calle = (<HTMLInputElement>document.getElementById("calle")).value;
    let noExt = (<HTMLInputElement>document.getElementById("noExt")).value;
    let noInt = (<HTMLInputElement>document.getElementById("noInt")).value;
    let IdDomicilio = (<HTMLInputElement>document.getElementById("colonia")).value;
    if (noInt == "" || noInt == null || noInt == undefined) {
      noInt = "0";
    }
    let noExt2 = parseInt(noExt);
    let data = {
      "calle": calle,
      "noExt": noExt2,
      "noInt": noInt,
      "idDomicilio": IdDomicilio,
      "idCliente": this.cliente,

    }

    axios.post("https://localhost:7010/api/Direccion/addAddress?idUsuariob=" + this.user, data).then((res) => {

      Swal.fire({
        icon: 'success',
        title: 'Dirección agregada con éxito',
        showConfirmButton: false,
        timer: 1500
      })

     // window.location.reload();
     window.location.href = "/profile?page=2";

      this.initForm();
      this.getEstados();
      this.getCiuades();
      this.getCp();
      this.getColonias();

    }

    ).catch((error) => {

      Swal.fire({
        title: 'Ocurrió un error',
        text: 'Los datos de su dirección son incorrectos. Intente nuevo',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
      console.log(error);

    }

    );





  }
  async getColonias() {
    let cp = (<HTMLInputElement>document.getElementById("cp")).value;
    this.colonias = [];
    await axios.get("https://localhost:7010/api/Direccion/getColonia?cp=" + cp).then((res) => {
      this.colonias = res.data;
    });

  }

  async getCiuades() {

    let estado = (<HTMLInputElement>document.getElementById("estado")).value;
    this.ciudades = [];
    await axios.get("https://localhost:7010/api/Direccion/getCiudades?estado=" + estado).then((res) => {
      this.ciudades = res.data.sort();
    });



  }

  async getEstados() {

    this.estados = [];
    await axios.get("https://localhost:7010/api/Direccion/getEstados").then((res) => {
      this.estados = res.data.sort();
    });


  }

  async getCp() {

    this.cps = [];
    let ciudad = (<HTMLInputElement>document.getElementById("ciudad")).value;

    await axios.get("https://localhost:7010/api/Direccion/getCp?ciudad=" + ciudad).then((res) => {
      this.cps = res.data;
    }

    );

  }


  onUpdate() {
    //https://localhost:7010/Address/Address/updateAddress?idDireccion=1

    /*{
      "calle": "string",
      "noExt": 0,
      "noInt": 0,
      "idDomicilio": 0,
      "idCliente": 0,
    } */

    Swal.fire({
      title: 'Alerta de confirmación',
      text: "¿Desea guardar los cambios en el sistema?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {


        let calle = (<HTMLInputElement>document.getElementById("calle")).value;
        let noExt = (<HTMLInputElement>document.getElementById("noExt")).value;
        let noInt = (<HTMLInputElement>document.getElementById("noInt")).value;
        let IdDomicilio = (<HTMLInputElement>document.getElementById("colonia")).value;

        if (noInt == "" || noInt == null || noInt == undefined) {
          noInt = "0";
        }


        let noExt2 = parseInt(noExt);
        let data = {
          "calle": calle,
          "noExt": noExt2,
          "noInt": noInt,
          "idDomicilio": IdDomicilio,
          "idCliente": this.cliente,
          "idUsuario": this.user

        }

        axios.post("https://localhost:7010/api/Direccion/updateAddress?idDireccion=" + this.id + "&idUsuariob=" + this.user, data).then((res) => {

          Swal.fire({
            icon: 'success',
            title: 'Dirección actualizada',
            showConfirmButton: false,
            timer: 1500
          })

          //window.location.reload();
          window.location.href = "/profile?page=2";


        }).catch((error) => {

          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error',
            text: '¡Algo salió mal! Intente de nuevo',
          })

        }

        );


      }

    });

  }






}