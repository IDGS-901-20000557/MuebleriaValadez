import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import axios from 'axios';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']


})



export class ProfileComponent {

  //declarar user
  user: any;
  cliente: any;

  mostrarFormulario: boolean = false;
  tarjetas: any[] = [];

  direcciones: any = [];
  IdDireccion : any = 0;

  email: any;
  nombre: any;
  rfc: any;
  telefono: any;
  rol: any;
  page: any = 1;



  constructor() { }

  ngOnInit(): void {


    //ira papito chulo 
    //http://localhost:4200/profile?page=2

    let url = window.location.href;

    let params = url.split("?")[1];

    if (params != undefined) {

       this.page = params.split("=")[1];

 

    }



    this.email = sessionStorage.getItem("email");
    this.nombre = sessionStorage.getItem("nombre");
    this.rfc = sessionStorage.getItem("rfc");
    this.telefono = sessionStorage.getItem("telefono");
    this.rol = sessionStorage.getItem("rol");



    this.mostrarTab(this.page);
    this.user = sessionStorage.getItem("idUsuario");
    this.cliente = sessionStorage.getItem("idCliente");
    

    axios.post("https://localhost:7010/api/Tarjeta/GetTarjetas?id=" + this.cliente).then((res) => {

      this.tarjetas = res.data.data;


    }

    ).catch((error) => {
      console.log(error);
    }

    );

    //https://localhost:7010/Address/Address/getClienteDirecciones?idCliente=1

    this.cliente = sessionStorage.getItem("idCliente");

    axios.get("https://localhost:7010/api/Direccion/getClienteDirecciones?idCliente=" + this.cliente).then((res) => {

      this.direcciones = res.data;
      console.log(this.direcciones);

    }).catch((error) => {

      console.log(error);

    });



  }

  activeTab: number = 1;

  mostrarTab(tabNumber: number) {


    //window.history.pushState({}, document.title, "/profile?page=" + tabNumber);

    window.history.pushState({}, document.title, "/profile?page=" + tabNumber);
    this.IdDireccion = 0;

    this.mostrarFormulario = false;

    console.log(tabNumber);
    this.activeTab = tabNumber;

    let divname = "contenido" + tabNumber;
    let div = <HTMLDivElement>document.getElementById(divname);

    for (let i = 1; i <= 3; i++) {
      if (i != tabNumber) {
        let divname = "contenido" + i;
        let div = <HTMLDivElement>document.getElementById(divname);
        div.style.display = "none";
      }
    }

    div.style.display = "block";



  }
  editProfile() {



  }

  verDetallesTarjeta(tarjetaId: number | null) {
    // Lógica para ver los detalles de la tarjeta seleccionada
  }


  closeForm() {

    this.mostrarFormulario = false;
    this.IdDireccion = 0;

  }

  editarDireccion(direccionId: number | null) {

    //agarrar el div edityar
    console.log(direccionId);

    this.mostrarFormulario = true;

    this.IdDireccion = direccionId;

  }


  dropDireccion(direccionId: number | null) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D9BF0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {


        let datos = {
          'idUsuario': this.user,
          'idCliente': this.cliente,
        }

        axios.post("https://localhost:7010/api/Direccion/deleteAddress?idDireccion=" + direccionId + "&idUsuariob="  + this.user , datos).then((res) => {

          Swal.fire(
            'Eliminado!',
            'Tu dirección ha sido eliminada.',
            'success'
          )

          window.location.reload();


        

        }).catch((error) => {

          console.log(error);

        });

      }
    })

  }

}
