import {
  Component,
  ElementRef,
  ViewChild,
  Renderer2,
  OnInit,
} from '@angular/core';
import axios from 'axios';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent  implements OnInit {
  registroUpForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {}
  dtOptions = {};
  usuarios: any[] = [];
  selectedUserType: number = 1;
  userData: any = {};// Variable para almacenar los datos del usuario del formulario
  sucurzales: any[] = [];
  roles: any[] = [];
  //para saber si esta editando o no
  isUpdate: boolean = false;
  idUpdate: number = 0;

  user: any;

  ngOnInit(): void {

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
    this.registroUpForm = this.fb.group({});
    this.user = sessionStorage.getItem("idUsuario");
    this.registroUpForm.addControl(
      'nombres',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ])
    );

    this.registroUpForm.addControl(
      'ApellidoPaterno',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ])
    );

    this.registroUpForm.addControl(
      'ApellidoMaterno',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ])
    );


  

    this.registroUpForm.addControl(
      'Telefono',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ])
    );

    this.registroUpForm.addControl(
      'email',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ])
    );

    this.registroUpForm.addControl(
      'password',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ])
    );


  

    this.registroUpForm.addControl(
      'Rfc',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ])
    );

    this.registroUpForm.addControl(
      'Puesto',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ])
    );

    this.registroUpForm.addControl(
      'Sucursal',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ])
    );


   

    this.registroUpForm.addControl(
      'Rol',
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


    // Llamada al servicio para obtener los usuarios
    this.getData();
  }


  getData = async () => {
    
  await  axios.get('https://localhost:7010/user/User/users')
      .then((response) => {
        this.usuarios = response.data;
        console.log(this.usuarios);
        //recargar la tabla
        //this.dtTrigger.next();
      }
      )
      .catch((error) => {
        console.log(error);
      }
      );

    // Llamada al servicio para obtener las sucursales
    await axios.get('https://localhost:7010/user/User/sucursales')
      .then((response) => {
        this.sucurzales = response.data;
        console.log(this.sucurzales);
      }
      )
      .catch((error) => {
        console.log(error);
      }
      );

    // Llamada al servicio para obtener los roles
    await axios.get('https://localhost:7010/user/User/roles')
      .then((response) => {
        this.roles = response.data;
        console.log(this.roles);
      }
      )
      .catch((error) => {

        console.log(error);

      });

    }

  selectedUserTypeChanged() {

   
    this.isUpdate = false;
    let tipe = (<HTMLInputElement>document.getElementById("userType")).value;
    this.selectedUserType = parseInt(tipe);
    console.log(this.selectedUserType);
    if (this.selectedUserType === 1) {
      //cambiar el tipo de usuario
       //limpiar los inputs
       
    (<HTMLInputElement>document.getElementById("txtnombre")).value = "";
    (<HTMLInputElement>document.getElementById("txtAPaterno")).value = "";
    (<HTMLInputElement>document.getElementById("txtAMaterno")).value = "";
    (<HTMLInputElement>document.getElementById("txtTelefono")).value = "";
    (<HTMLInputElement>document.getElementById("txtCorreo")).value = "";
    (<HTMLInputElement>document.getElementById("txtPassword")).value = "";
     //  this.selectedUserType = 2;
//como no encuentra todos estos inputs por eso  da el error de que no los haya tons quizas sea al reves asi

    } else if (this.selectedUserType === 2) {
      //cambiar el tipo de usuario
     //  this.selectedUserType = 1;

   
    (<HTMLInputElement>document.getElementById("txtnombre")).value = "";
    (<HTMLInputElement>document.getElementById("txtAPaterno")).value = "";
    (<HTMLInputElement>document.getElementById("txtAMaterno")).value = "";
    (<HTMLInputElement>document.getElementById("txtTelefono")).value = "";
    (<HTMLInputElement>document.getElementById("txtCorreo")).value = "";
    (<HTMLInputElement>document.getElementById("txtPassword")).value = "";
    (<HTMLInputElement>document.getElementById("txtRfc")).value = "";
    (<HTMLInputElement>document.getElementById("txtSucursal")).value = "";
    (<HTMLInputElement>document.getElementById("txtPuesto")).value = "";
    (<HTMLInputElement>document.getElementById("txtRol")).value = "";
    }
  }

  guardarUsuario() {

    if (this.selectedUserType === 1) {
      this.guardarEmpleado();
    } else if (this.selectedUserType === 2) {
      this.guardarCliente();
    }
  }

  guardarEmpleado() {

let sucursal =(<HTMLInputElement>document.getElementById("txtSucursal")).value;

let rol =(<HTMLInputElement>document.getElementById("txtRol")).value;

if (sucursal == "" || rol == "") {
  Swal.fire({ 
    icon: 'error',
    title: 'Oops...',
    text: 'Faltan campos por llenar'
  })

  return;

} 

    const formData = {
      nombres :(<HTMLInputElement>document.getElementById("txtnombre")).value,
      apellidoPaterno :(<HTMLInputElement>document.getElementById("txtAPaterno")).value,
      apellidoMaterno :(<HTMLInputElement>document.getElementById("txtAMaterno")).value,
      telefono :(<HTMLInputElement>document.getElementById("txtTelefono")).value,
      email :(<HTMLInputElement>document.getElementById("txtCorreo")).value,
      password:  crypto.SHA512((<HTMLInputElement>document.getElementById("txtPassword")).value).toString(),
      rfc :(<HTMLInputElement>document.getElementById("txtRfc")).value,
      sucursal :(<HTMLInputElement>document.getElementById("txtSucursal")).value,
      puesto :(<HTMLInputElement>document.getElementById("txtPuesto")).value,
      rol :(<HTMLInputElement>document.getElementById("txtRol")).value,
      idUsuariob : this.user

    };

    const apiUrl = 'https://localhost:7010/user/User/registerEm?&idUsuariob=' + this.user;
//es este vedas
    axios.post(apiUrl, formData)
      .then((response) => {
        // Lógica en caso de éxito
        console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado',
          text: 'El usuario se ha registrado correctamente',
          showConfirmButton: true,
          timer: 1500
  
         }).then(() => {
          window.location.reload();
          });
      })
      .catch((error) => {
        // Lógica en caso de error
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message
        });
      });
  }

  guardarCliente() {
  
    const formData = {

      //ira apa vas a agarrar los datos de los inputs y los vas a poner aqui pero para angular porque no lee el document

      nombres :(<HTMLInputElement>document.getElementById("txtnombre")).value,
      apellidoPaterno :(<HTMLInputElement>document.getElementById("txtAPaterno")).value,
      apellidoMaterno :(<HTMLInputElement>document.getElementById("txtAMaterno")).value,
      telefono :(<HTMLInputElement>document.getElementById("txtTelefono")).value,
      email :(<HTMLInputElement>document.getElementById("txtCorreo")).value,
      password:  crypto.SHA512((<HTMLInputElement>document.getElementById("txtPassword")).value).toString(),
      idUsuariob : this.user

    };
    const apiUrl = 'https://localhost:7010/user/User/register?&idUsuariob=' + this.user;

    axios.post(apiUrl, formData)
      .then((response) => {
        // Lógica en caso de éxito
       // console.log(response.data);
       Swal.fire({
        icon: 'success',
        title: 'Usuario registrado',
        text: 'El usuario se ha registrado correctamente',
        showConfirmButton: false,
        timer: 1500

       }).then(() => {
        window.location.reload();
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message
        });


      });
  }



  deleteUser = async (id: number) => {

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
      if (result.isConfirmed) {
        Swal.fire(
          {
            title: 'Eliminando usuario',
            html: '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>',
            showConfirmButton: true,
            allowOutsideClick: false
          }
        );



        let data = {
          idUsuariob: this.user
        }

     axios.post('https://localhost:7010/user/User/EliminarUsuario?id=' + id + "&idUsuariob=" + this.user, data) //cambiar la url por la de eliminar usuario
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario eliminado',
          text: 'El usuario se ha eliminado correctamente',
          showConfirmButton: true,
          timer: 1500

          }).then(() => {

            window.location.reload();
          }

          );

      })


      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message
        });
      }
      );


    }

    });


  }

  password(){

//

let password = (<HTMLInputElement>document.getElementById("txtPassword")).value;

//guacha esta accion simpre se va a ejecutar cuando se escriba algo en el input
//si el password no contiene una mayuscula se mandan un mensaje en el div de error
if(!password.match(/[A-Z]/)){
  let div  = <HTMLInputElement>document.getElementById("passmensaje");
  div.innerHTML = "La contraseña debe contener al menos una mayúscula";
  div.style.display = "block";
  return;
}

//si el password no contiene una minuscula se mandan un mensaje en el div de error
if(!password.match(/[a-z]/)){
  let div  = <HTMLInputElement>document.getElementById("passmensaje");
  div.innerHTML = "La contraseña debe contener al menos una minúscula";
  div.style.display = "block";
  return;
}

//si el password no contiene un numero se mandan un mensaje en el div de error
if(!password.match(/[0-9]/)){
  let div  = <HTMLInputElement>document.getElementById("passmensaje");
  div.innerHTML = "La contraseña debe contener al menos un número";
  div.style.display = "block";
  return;
}

//si el password no contiene un caracter especial se mandan un mensaje en el div de error
if(!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)){
  let div  = <HTMLInputElement>document.getElementById("passmensaje");
  div.innerHTML = "La contraseña debe contener al menos un caracter especial";
  div.style.display = "block";
  return;
}

//si contiene todo lo anterior se oculta el div de error
let div  = <HTMLInputElement>document.getElementById("passmensaje");
div.style.display = "none";



  }
  activarUser = async (id: number) => {

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
      if (result.isConfirmed) {
        Swal.fire(
          {
            title: 'Activando usuario',
            html: '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>',
            showConfirmButton: false,
            allowOutsideClick: false
          }
        );


        let data = {
          idUsuariob: this.user
        }

     axios.post('https://localhost:7010/user/User/ActivarUsuario?id=' + id + "&idUsuariob=" + this.user, data)
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario Activado',
          text: 'El usuario se ha Activado correctamente',
          showConfirmButton: false,
          timer: 1500

          }).then(() => {

            window.location.reload();
          }

          );

      })


      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message
        });
      }
      );


    }

    });


  }



  //Empezamos con el editar

  //primero vamos a hacer la funcion que mande los datos al formulario

  editarUser = async (usaurio : any) => {

    //console.log(usaurio);

    //ahora vamos a mandar los datos al formulario

    //poner el tipo de usario a cliente o empleado
    this.selectedUserType =  2;
    this.isUpdate = true;
    this.idUpdate = usaurio.idUsuario;

    (<HTMLInputElement>document.getElementById("txtnombre")).value = usaurio.nombres;
    (<HTMLInputElement>document.getElementById("txtAPaterno")).value = usaurio.apellidoPaterno;
    (<HTMLInputElement>document.getElementById("txtAMaterno")).value = usaurio.apellidoMaterno;
    (<HTMLInputElement>document.getElementById("txtTelefono")).value = usaurio.telefono;
    (<HTMLInputElement>document.getElementById("txtCorreo")).value = usaurio.email;
    (<HTMLInputElement>document.getElementById("txtPassword")).value = usaurio.password;
   // (<HTMLInputElement>document.getElementById("txtRfc")).value = usaurio.rfc;
   // (<HTMLInputElement>document.getElementById("txtSucursal")).value = usaurio.sucursal;
    //(<HTMLInputElement>document.getElementById("txtPuesto")).value = usaurio.puesto;
   // (<HTMLInputElement>document.getElementById("txtRol")).value = usaurio.rol;



  }


  editarEmpleado = async (id: number) => {


    //consultar el usuario para ponerlo en los inputs pero primero vamos a cambiar el tipo de usuario a empleado
    this.selectedUserType =  1;
    this.isUpdate = true;
    this.idUpdate = id;


    axios.get('https://localhost:7010/user/User/empleados?id=' + id)
    .then((response) => {
       
      (<HTMLInputElement>document.getElementById("txtnombre")).value = response.data[0].nombres;
      (<HTMLInputElement>document.getElementById("txtAPaterno")).value = response.data[0].apellidoPaterno;
      (<HTMLInputElement>document.getElementById("txtAMaterno")).value = response.data[0].apellidoMaterno;
      (<HTMLInputElement>document.getElementById("txtTelefono")).value = response.data[0].telefono;
      (<HTMLInputElement>document.getElementById("txtCorreo")).value = response.data[0].email;
      (<HTMLInputElement>document.getElementById("txtPassword")).value = response.data[0].password;
      (<HTMLInputElement>document.getElementById("txtRfc")).value = response.data[0].rfc;
      (<HTMLInputElement>document.getElementById("txtSucursal")).value = response.data[0].sucursalId;
      (<HTMLInputElement>document.getElementById("txtPuesto")).value = response.data[0].puesto;
      (<HTMLInputElement>document.getElementById("txtRol")).value = response.data[0].idRol;
    //  (<HTMLInputElement>document.getElementById("txtRol")).disabled = true;
    })
    .catch((error) => {
      console.log(error);
    }
    );

  }



  //getEmpelado

  getEmpleado = async (id: number) => {


    axios.get('https://localhost:7010/user/User/empleados?id=' + id)
    .then((response) => {

      //hacer un Swal.fire con los datos del empleado pero como si fuera una modal

      Swal.fire({
        title: '<div class="container-fluid mt-0 mb-0" style="text-align: center; background-color: #B88736; color: white; width: 100%; height: 100%; padding: 10px;">' + response.data[0].nombres + ' ' + response.data[0].apellidoPaterno + ' ' + response.data[0].apellidoMaterno + '</div>',

        html:
          '<div class="container-fluid">' +
          '<div class="row">' +
          '<div class="col-6">' +
          '<div class="form-group">' +
          '<label for="txtNombre">Nombre</label>' +
          '<input type="text" class="form-control" id="txtNombre" value="' + response.data[0].nombres + '" readonly>' +
          '</div>' +
          '</div>' +
          '<div class="col-6">' +
          '<div class="form-group">' +
          '<label for="txtAPaterno">Apellido Paterno</label>' +
          '<input type="text" class="form-control" id="txtAPaterno" value="' + response.data[0].apellidoPaterno + '" readonly>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="row">' +
          '<div class="col-6">' +
          '<div class="form-group">' +
          '<label for="txtAMaterno">Apellido Materno</label>' +
          '<input type="text" class="form-control" id="txtAMaterno" value="' + response.data[0].apellidoMaterno + '" readonly>' +
          '</div>' +
          '</div>' +
          '<div class="col-6">' +
          '<div class="form-group">' +
          '<label for="txtTelefono">Telefono</label>' +
          '<input type="text" class="form-control" id="txtTelefono" value="' + response.data[0].telefono + '" readonly>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="row">' +

          '<div class="col-6">' +
          '<div class="form-group">' +
          '<label for="txtCorreo">Correo</label>' +
          '<input type="text" class="form-control" id="txtCorreo" value="' + response.data[0].email + '" readonly>' +
          '</div>' +
          '</div>' +

          '<div class="col-6">' +
          '<div class="form-group">' +
          '<label for="txtPassword">Password</label>' +
          '<input type="password" class="form-control" id="txtPassword" value="' + response.data[0].password + '" readonly>' +
          '</div>' +
          '</div>' +

          '</div>' +

          '<div class="row">' +

          '<div class="col-6">' +

          '<div class="form-group">' +
          '<label for="txtRfc">RFC</label>' +
          '<input type="text" class="form-control" id="txtRfc" value="' + response.data[0].rfc + '" readonly>' +
          '</div>' +

          '</div>' +

          '<div class="col-6">' +

          '<div class="form-group">' +
          '<label for="txtSucursal">Sucursal</label>' +
          '<input type="text" class="form-control" id="txtSucursal" value="' + response.data[0].sucursalId + '" readonly>' +
          '</div>' +
          
          '</div>' +

          '</div>' +

          '<div class="row">' +

          '<div class="col-6">' +

          '<div class="form-group">' +
          '<label for="txtPuesto">Puesto</label>' +
          '<input type="text" class="form-control" id="txtPuesto" value="' + response.data[0].puesto + '" readonly>' +
          '</div>' +

          '</div>' +

          '<div class="col-6">' +

          '<div class="form-group">' +
          '<label for="txtRol">Rol</label>' +
          '<input type="text" class="form-control" id="txtRol" value="' + response.data[0].idRol + '" readonly>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>',
          width: 800,
          showCloseButton: true,
          closeButtonHtml: '<div style="color: white; margin-top: 25px; margin-right: 25px;"><i class="fa fa-times"></i></div>',
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText:
              '<i class="fa fa-thumbs-up"></i> OK!',
          showConfirmButton: false,
          confirmButtonAriaLabel: 'Thumbs up, great!',
          cancelButtonText:
              '<i class="fa fa-thumbs-down"></i>',
          cancelButtonAriaLabel: 'Thumbs down',
          

      })
    })
    .catch((error) => {
      console.log(error);
    }
    );
  }


  //ahora vamos a hacer la funcion que mande los datos al backend

  editarUsuario = async () => {


    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
       
        //https://localhost:7010/user/User/ModificarUsuario?idUsuario=10005

        //primero vamos a obtener los datos de los inputs

        let data = {
          nombres: (<HTMLInputElement>document.getElementById("txtnombre")).value,
          apellidoPaterno: (<HTMLInputElement>document.getElementById("txtAPaterno")).value,
          apellidoMaterno: (<HTMLInputElement>document.getElementById("txtAMaterno")).value,
          telefono: (<HTMLInputElement>document.getElementById("txtTelefono")).value,
          email: (<HTMLInputElement>document.getElementById("txtCorreo")).value,
          password:  crypto.SHA512((<HTMLInputElement>document.getElementById("txtPassword")).value).toString(),
          idUsuario: this.user

        }

        //ahora vamos a hacer la peticion
        let api = 'https://localhost:7010/user/User/ModificarUsuario?idUsuario=' + this.idUpdate + '&idUsuariob=' + this.user;

        axios.post(api, data).then((response) => {
            
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Usuario editado correctamente',
              showConfirmButton: true,
              timer: 1500
  
              }).then(() => {
  
                window.location.reload();
              }
  
              );
  
          }
          ).catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response.data.message
            });
          }
          );

        }

    })        

  }


  editarEmpleadoback = async () => {

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
       

        let data = {
          nombres: (<HTMLInputElement>document.getElementById("txtnombre")).value,
          apellidoPaterno: (<HTMLInputElement>document.getElementById("txtAPaterno")).value,
          apellidoMaterno: (<HTMLInputElement>document.getElementById("txtAMaterno")).value,
          telefono: (<HTMLInputElement>document.getElementById("txtTelefono")).value,
          email: (<HTMLInputElement>document.getElementById("txtCorreo")).value,
          password: crypto.SHA512((<HTMLInputElement>document.getElementById("txtPassword")).value).toString(),
          rfc: (<HTMLInputElement>document.getElementById("txtRfc")).value,
          sucursal: (<HTMLInputElement>document.getElementById("txtSucursal")).value,
          puesto: (<HTMLInputElement>document.getElementById("txtPuesto")).value,
          rol: (<HTMLInputElement>document.getElementById("txtRol")).value,
          idUsuariob: this.user


        }

        let api = 'https://localhost:7010/user/User/ModificarEmpelado?idUsuario=' + this.idUpdate + '&idUsuariob=' + this.user;

        axios.post(api, data).then((response) => {
            
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Empleado editado correctamente',
              showConfirmButton: true,
              timer: 1500
  
              }).then(() => {
  
                window.location.reload();
              }
  
              );
  
          }
          ).catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response.data.message
            });
          }
          );

        }

    })        

  }
  

  //cancelar

  cancelarUs = async () => {

    //primero que limpie los inputs

    
    this.isUpdate = false;

    (<HTMLInputElement>document.getElementById("txtnombre")).value = "";
    (<HTMLInputElement>document.getElementById("txtAPaterno")).value = "";
    (<HTMLInputElement>document.getElementById("txtAMaterno")).value = "";
    (<HTMLInputElement>document.getElementById("txtTelefono")).value = "";
    (<HTMLInputElement>document.getElementById("txtCorreo")).value = "";
    (<HTMLInputElement>document.getElementById("txtPassword")).value = "";

  }

  cancelarEm = async () => {

    //primero que limpie los inputs

    
    this.isUpdate = false;

    (<HTMLInputElement>document.getElementById("txtnombre")).value = "";
    (<HTMLInputElement>document.getElementById("txtAPaterno")).value = "";
    (<HTMLInputElement>document.getElementById("txtAMaterno")).value = "";
    (<HTMLInputElement>document.getElementById("txtTelefono")).value = "";
    (<HTMLInputElement>document.getElementById("txtCorreo")).value = "";
    (<HTMLInputElement>document.getElementById("txtPassword")).value = "";
    (<HTMLInputElement>document.getElementById("txtRfc")).value = "";
    (<HTMLInputElement>document.getElementById("txtSucursal")).value = "";
    (<HTMLInputElement>document.getElementById("txtPuesto")).value = "";
    (<HTMLInputElement>document.getElementById("txtRol")).value = "";

  }

}