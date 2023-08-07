import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  form: FormGroup = this.fb.group({
    from_email: "",
    message: ''
  })
  
  constructor(private fb: FormBuilder) { }

  async contact() {
    emailjs.init('xgPSRYY5hd60NNxxb');
    let response = await emailjs.send("service_ckmdd7c", "template_sn9nh14", {
      from_name: "Mueblería Valadez",
      to_name: "Admin",
      subject: "Correo de contacto",
      message: this.form.value.message,
      from_email: this.form.value.from_email,
    });

    if(response.status == 200){
      Swal.fire({
        title: '¡Muchas gracias!',
        text: 'Se ha enviado correctamente su información. Agradecemos su confianza.',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#28a745', // Color verde para el botón de éxito
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn-success' // Agrega la clase 'btn-success' al botón de éxito
        }
      });
    } else {
      Swal.fire({
        title: 'Ocurrió un problema',
        text: 'No se pudo enviar su petición a nuestro servidor. Intente de nuevo.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn-warning'
        }
      });
    }
    

    this.form.reset();
  }
}
