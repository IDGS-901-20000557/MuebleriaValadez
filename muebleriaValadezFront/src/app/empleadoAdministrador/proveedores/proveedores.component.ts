import { Component, Renderer2, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedorComponent {

  registroProvForm! : FormGroup;

  constructor(
    private fb : FormBuilder,
    private render : Renderer2
  ) { }

  dtOptions = {};
  proveedores: any[] = [];
  provData: any = {};
 //para saber si esta editando o no
 isUpdate: boolean = false;
 idUpdate: number = 0;
 user : any;



 ngOnInit(): void {
        //desde aqui
        let url = window.location.href;

        let params = url.split("?");
        console.log(params);
        if (params.length == 2) {
          let charge = params[1].split("=");
          console.log(charge);
          let charge1 = parseInt(charge[1]);
          console.log(charge1);
          window.history.pushState({}, '', params[0]);
    
          if (charge1 == 1) {
            window.location.reload();
          }
        }
    
        //hasta aqui
  this.user = sessionStorage.getItem("idUsuario");


  this.registroProvForm = this.fb.group({});

  this.registroProvForm.addControl(
    'nombreEmpresa',
    this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ])
  );

  this.registroProvForm.addControl(
    'nombres',
    this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ])
  );

  this.registroProvForm.addControl(
    'ApellidoPaterno',
    this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ])
  );

  this.registroProvForm.addControl(
    'ApellidoMaterno',
    this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ])
  );

  this.registroProvForm.addControl(
    'Telefono',
    this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ])
  );

  this.registroProvForm.addControl(
    'InfoExtra',
    this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ])
  );




  // Inicializa DataTables en el elemento HTML de la tabla
  this.dtOptions = {
    pagingType: 'full_numbers',
    // Idioma en español
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
    },
    dom: 'Blfrtip',
    buttons: [
      {
        extend: 'copy',
        text: '<i class="fa-solid fa-copy"></i> ',
        titleAttr: 'Copiar contenido',
        className: 'btn btn-secondary'
      },
      {
        extend: 'excelHtml5',
        text: '<i class="fas fa-file-excel"></i> ',
        titleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i> ',
        titleAttr: 'Exportar a PDF',
        className: 'btn btn-danger'
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-danger'
      },
    ],
    // Uso de botones   
    responsive: true,
  };


  this.getData();
  // Llamada al servicio para obtener los proveedores

 
  }


  getData = async () => {
    
  axios.get('https://localhost:7010/proveedor/Proveedor/proveedores')
  .then((response) => {
    this.proveedores = response.data;
    console.log(this.proveedores);
    //recargar la tabla
    //this.dtTrigger.next();
  }
  )
  .catch((error) => {
    console.log(error);
  }
  );

}

  //metodo para registrar un proveedor

  registrarProveedor() {

  const formData = {

    nombreEmpresa: (<HTMLInputElement> document.getElementById('txtnombrempresa')).value,
    nombres: (<HTMLInputElement> document.getElementById('txtnombre')).value,
    apellidoPaterno: (<HTMLInputElement> document.getElementById('txtAPaterno')).value,
    apellidoMaterno: (<HTMLInputElement> document.getElementById('txtAMaterno')).value,
    telefono: (<HTMLInputElement> document.getElementById('txtTelefono')).value,
    informacionExtra  : (<HTMLTextAreaElement> document.getElementById('txtInfoExtra')).value,  };

  const apiUri = 'https://localhost:7010/proveedor/Proveedor/registerProv?idUsuariob=' + this.user;

  axios.post(apiUri, formData)
    .then((response) => {

      Swal.fire({
        icon: 'success',
        title: 'Proveedor registrado',
        text: 'El proveedor se ha registrado correctamente',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#20a124',

       }).then(() => {
        window.location.reload();
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#20a124',
        });


      });
    }



    traerDatosProveedor = async (proveedor: any) => {

      this.isUpdate = true;
      this.idUpdate = proveedor.idProveedor;

      (<HTMLInputElement> document.getElementById('txtnombrempresa')).value = proveedor.nombreEmpresa;
      (<HTMLInputElement> document.getElementById('txtnombre')).value = proveedor.nombres;
      (<HTMLInputElement> document.getElementById('txtAPaterno')).value = proveedor.apellidoPaterno;
      (<HTMLInputElement> document.getElementById('txtAMaterno')).value = proveedor.apellidoMaterno;
      (<HTMLInputElement> document.getElementById('txtTelefono')).value = proveedor.telefono;
      (<HTMLTextAreaElement> document.getElementById('txtInfoExtra')).value = proveedor.informacionExtra;

    }

    //actualiza proveedor

    actualizarProveedor  =  async () => {

      const formData = {
        nombreEmpresa: (<HTMLInputElement> document.getElementById('txtnombrempresa')).value,
        nombres: (<HTMLInputElement> document.getElementById('txtnombre')).value,
        apellidoPaterno: (<HTMLInputElement> document.getElementById('txtAPaterno')).value,
        apellidoMaterno: (<HTMLInputElement> document.getElementById('txtAMaterno')).value,
        telefono: (<HTMLInputElement> document.getElementById('txtTelefono')).value,
        informacionExtra  : (<HTMLTextAreaElement> document.getElementById('txtInfoExtra')).value,
      };

      const apiUri = `https://localhost:7010/proveedor/Proveedor/updateProv?idProveedor=${this.idUpdate} &idUsuariob=${this.user}`;

      axios.post(apiUri, formData)
        .then((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Proveedor actualizado',
            text: 'El proveedor se ha actualizado correctamente',
            showConfirmButton: false,
            timer: 3500,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#20a124'
          }).then(() => {
            window.location.reload();
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#20a124'
          });
        });
    }

    //elimina proveedor

    eliminarProveedor = async (idProveedor: number) => {
        
        Swal.fire({
          title: '¿Estás seguro?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#20a124',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
  
            const apiUri = `https://localhost:7010/proveedor/Proveedor/EliminarProveedor?id=${idProveedor} &idUsuariob=${this.user}`;
  
            axios.post(apiUri)
              .then((response) => {
                Swal.fire(
                  '¡Eliminación correcta!',
                  'El proveedor ha sido eliminado.',
                  'success',
                ).then(() => {
                  window.location.reload();
                });
              })
              .catch((error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error.response.data.message,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#20a124'
                });
              });
          }
        });
      }


      activarProveedor = async (idProveedor: number) => {
        
        Swal.fire({
          title: '¿Estás seguro?',
          text: "Esta acción reactivará el proveedor eliminado.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#20a124',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Sí, reactivar!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
      
            const apiUri = `https://localhost:7010/proveedor/Proveedor/ActivarProveedor?id=${idProveedor} &idUsuariob=${this.user}`;
      
            axios.post(apiUri)
              .then((response) => {
                Swal.fire(
                  '¡Proveedor Activado!',
                  'El proveedor ha sido nuevamente activado.',
                  'success'
                ).then(() => {
                  window.location.reload();
                });
              })
              .catch((error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error.response.data.message,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#20a124'
                });
              });
          }
        });
      }
}



 




 