import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';
import { LoadingService } from 'src/app/loading.service';
import * as crypto from 'crypto-js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,private authService: AuthService, private loadingService: LoadingService,private router: Router) {

   }

  ngOnInit(): void {
    // Inicializa el formulario sin controles individuales en el constructor
    this.loginForm = this.fb.group({});

    // Agrega los controles individuales con sus validadores en el método ngOnInit
    this.loginForm.addControl('email', this.fb.control('', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)]));
    this.loginForm.addControl('password', this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]));
  }

  onSubmit() {
    // Si el formulario es válido, obtiene los datos ingresados
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.loadingService.show();
      // Realiza la solicitud HTTP al endpoint del backend
      this.authService.login(email, crypto.SHA512(password).toString())
        .then((response: any) => {
          sessionStorage.setItem('idUsuario', response[0].idUsuario);
          sessionStorage.setItem('idCliente', response[0].idCliente);
          sessionStorage.setItem('idEmpleado', response[0].idEmpleado);
          sessionStorage.setItem('email', response[0].email);
          sessionStorage.setItem('nombre', response[0].nombres+" "+response[0].apellidoPaterno+" "+response[0].apellidoMaterno);
          sessionStorage.setItem('idPersona', response[0].idPersona);
          sessionStorage.setItem('idDireccionSucursal', response[0].idDireccionSucursal);
          sessionStorage.setItem('idRol', response[0].idRol);
          sessionStorage.setItem('rfc', response[0].rfc);
          sessionStorage.setItem('rol', response[0].rol);
          sessionStorage.setItem('sucursal', response[0].sucursal);
          sessionStorage.setItem('telefono', response[0].telefono);
          if(sessionStorage.getItem('idRol')==='1'){
            //Administrador Dashboard
            this.router.navigateByUrl('/dashboardAdministrador');
          }else if(sessionStorage.getItem('idRol')==='2'){
            //Pagina de inicio empleado ventas
            this.router.navigateByUrl('/auth');
          }else if(sessionStorage.getItem('idRol')==='3'){
            //Pagina de inicio cliente
            this.router.navigateByUrl('/shop');
          }else if(sessionStorage.getItem('idRol')==='10002'){
           //Pagina de inicio empleado pedidos
            this.router.navigateByUrl('/auth');
          }
        })
        .catch((error: any) => {
          Swal.fire({
            icon: 'error',
            title: '¡Error de inicio de sesión!',
            text: 'Usuario o Contraseña incorrecta.',
          });
        }).finally(() => {
          this.loadingService.hide();// Ocultar el loader, tanto si hay éxito como error
        });

    }
  }
}
