import {
  Component,
  ElementRef,
  ViewChild,
  Renderer2,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupService } from './signup.service';
import Swal from 'sweetalert2';
import { LoadingService } from 'src/app/loading.service';
import * as crypto from 'crypto-js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private signUpService: SignupService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  isPasswordVisible = false;
  @ViewChild('asIcon') icono!: ElementRef;
  @ViewChild('asPassword') password!: ElementRef;
  ngOnInit(): void {
    // Inicializa el formulario sin controles individuales en el constructor
    this.signUpForm = this.fb.group({});

    // Agrega los controles individuales con sus validadores en el método ngOnInit
    this.signUpForm.addControl(
      'nombre',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ])
    );
    this.signUpForm.addControl(
      'apellidoP',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ])
    );
    this.signUpForm.addControl(
      'apellidoM',
      this.fb.control('', [Validators.minLength(3), Validators.maxLength(50)])
    );
    this.signUpForm.addControl(
      'telefono',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20),
      ])
    );
    this.signUpForm.addControl(
      'email',
      this.fb.control('', [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(50),
      ])
    );
    this.signUpForm.addControl(
      'password',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ])
    );
    this.signUpForm.addControl('password2', this.fb.control(''));
  }
  onSubmit() {
    console.log(this.signUpForm.get('password')?.value);
    console.log(this.signUpForm.get('password2')?.value);
    if (this.signUpForm.valid) {
      if (
        this.signUpForm.get('password')?.value ==
        this.signUpForm.get('password2')?.value
      ) {
        this.signUpService.userFind(this.signUpForm.get('email')?.value)
      .then((result: any) => {
        // 'result' contiene el resultado como texto (puede ser "true" o "false")
        const exists = JSON.parse(result); // Convierte el texto a un valor booleano
        console.log(exists.exists);
        if (exists.exists) {
          Swal.fire({
            icon: 'info',
            title: '¡Elija otro correo!',
            text: 'El correo ya esta en uso',
          });
        } else {
          const nombre = this.signUpForm.get('nombre')?.value;
        const apellidoP = this.signUpForm.get('apellidoP')?.value;
        const apellidoM = this.signUpForm.get('apellidoM')?.value;
        const telefono = this.signUpForm.get('telefono')?.value;
        const email = this.signUpForm.get('email')?.value;
        const password = crypto
          .SHA512(this.signUpForm.get('password')?.value)
          .toString();
        this.loadingService.show();
        this.signUpService
          .signUp(nombre, apellidoP, apellidoM, telefono, email, password)
          .then((response: any) => {

            Swal.fire({
              icon: 'success',
              title: '¡Usuario creado!',
              text: '¡Bienvenido!',
              timer: 3000, // 3 segundos
              timerProgressBar: true, // Muestra una barra de progreso durante el tiempo de espera
              showConfirmButton: false // No muestra el botón de confirmación para cerrar el mensaje
            }).then(() => {
              // Redirigir al usuario a la página de inicio de sesión (/auth) después de mostrar el mensaje de éxito
              this.router.navigateByUrl('/auth');
            });
          })
          .catch((error: any) => {

            Swal.fire({
              icon: 'error',
              title: '¡Error a la hora de crear usuario!',
              text: 'Ocurrió un error al crear el usuario.',
            });
          })
          .finally(() => {
            this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
          });
        }
      })
      .catch((error: any) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de crear usuario!',
          text: 'Ocurrió un error al crear el usuario.',
        });
      });

      }
    }
  }

  changeIcon(): void {
    const asIcon = this.icono.nativeElement;
    const asPassword = this.password.nativeElement;

    if (this.isPasswordVisible) {
      this.renderer.setAttribute(asPassword, 'type', 'password');
      this.renderer.removeClass(asIcon, 'fa-eye-slash');
      this.renderer.addClass(asIcon, 'fa-eye');
      console.log(asIcon);
    } else {
      this.renderer.setAttribute(asPassword, 'type', 'text');
      this.renderer.removeClass(asIcon, 'fa-eye');
      this.renderer.addClass(asIcon, 'fa-eye-slash');
      console.log(asIcon);
    }

    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
