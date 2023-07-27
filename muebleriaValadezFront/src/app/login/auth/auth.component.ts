import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';
import { LoadingService } from 'src/app/loading.service';
import * as crypto from 'crypto-js';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,private authService: AuthService, private loadingService: LoadingService) {

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
      const apiUrl = 'https://localhost:7010/auth/Auth/login'; // Reemplaza con la URL de tu backend
      const body = { email, password }; // Datos a enviar al backend
      this.authService.login(email, password)
        .then((response: any) => {
          Swal.fire({
            icon: 'success',
            title: '¡Inicio de sesión exitoso!',
            text: 'Bienvenido de nuevo.',
          });
          sessionStorage.setItem('idUsuario', response[0].idUsuario);
          sessionStorage.setItem('email', response[0].email);
          sessionStorage.setItem('nombre', response[0].nombres+" "+response[0].apellidoPaterno+" "+response[0].apellidoMaterno);
          sessionStorage.setItem('idPersona', response[0].idPersona);
          sessionStorage.setItem('idDireccionSucursal', response[0].idDireccionSucursal);
          sessionStorage.setItem('idRol', response[0].idRol);
          sessionStorage.setItem('rfc', response[0].rfc);
          sessionStorage.setItem('rol', response[0].rol);
          sessionStorage.setItem('sucursal', response[0].sucursal);
          sessionStorage.setItem('telefono', response[0].telefono);
          console.log(sessionStorage.getItem('nombre'));
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
