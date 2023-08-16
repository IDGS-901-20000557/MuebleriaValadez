import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as crypto from 'crypto-js';
import axios from 'axios';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {
  profileForm!: FormGroup;
  user: any;
  nombre: any;
  apellidoPaterno: any;
  apellidoMaterno: any;
  telefono: any;
  email: any;
  password: any;



  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {

    //https://localhost:7010/user/User/user?id=40007

    this.user = sessionStorage.getItem("idUsuario");

    axios.get('https://localhost:7010/user/User/user?id=' + this.user).then((response) => {
      console.log(response.data);
      this.nombre = response.data[0].nombres;
      this.apellidoPaterno = response.data[0].apellidoPaterno;
      this.apellidoMaterno = response.data[0].apellidoMaterno;
      this.telefono = response.data[0].telefono;
      this.email = response.data[0].email;
      this.password = response.data[0].password;
    });




    this.initForm();
  }

  initForm(): void {
    this.profileForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {


    let nombre = (<HTMLInputElement>document.getElementById("txtnombre")).value;
    let apellidoPaterno = (<HTMLInputElement>document.getElementById("txtAPaterno")).value;
    let apellidoMaterno = (<HTMLInputElement>document.getElementById("txtAMaterno")).value;
    let telefono = (<HTMLInputElement>document.getElementById("txtTelefono")).value;
    let email = (<HTMLInputElement>document.getElementById("txtCorreo")).value;
    let password = (<HTMLInputElement>document.getElementById("txtPassword")).value;
    let passwordsave ="";
    //verificar que los campos no esten vacios
    if (nombre == "" || apellidoPaterno == "" || apellidoMaterno == "" || telefono == "" || email == "" || password == "") {

    
      Swal.fire({
        icon: 'error',
        title: 'Ocurrió un error',
        text: 'Favor de llenar todos los campos',
      })

    } else { 

      if (password == this.password) {

        passwordsave = this.password;
      } else
       {

        passwordsave  = crypto.SHA512(password).toString();

      }

      let data = {
        nombres: (<HTMLInputElement>document.getElementById("txtnombre")).value,
        apellidoPaterno: (<HTMLInputElement>document.getElementById("txtAPaterno")).value,
        apellidoMaterno: (<HTMLInputElement>document.getElementById("txtAMaterno")).value,
        telefono: (<HTMLInputElement>document.getElementById("txtTelefono")).value,
        email: (<HTMLInputElement>document.getElementById("txtCorreo")).value,
        password:  passwordsave,
        idUsuario: this.user

      }


      let api = 'https://localhost:7010/user/User/ModificarUsuario?idUsuario=' + this.user + '&idUsuariob=' + this.user;

      axios.post(api, data).then((res) => {

        sessionStorage.setItem("nombre", nombre + " " + apellidoPaterno + " " + apellidoMaterno);
        sessionStorage.setItem("telefono", telefono);
        sessionStorage.setItem("email", email);
        
       


        Swal.fire({
          icon: 'success',
          title: 'Datos actualizados',
          showConfirmButton: false,
          timer: 1500
        })

        setTimeout(function () {
          window.location.reload();
        }, 1500);

      }

      ).catch((error) => {

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un problema. Intente de nuevo',
        })

      }

      );



    }


  }
}
