import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  form: FormGroup = this.fb.group({
    from_email: "",
  })

  constructor(private fb: FormBuilder) { }

  async newsletter() {
    emailjs.init('xgPSRYY5hd60NNxxb');
    let response = await emailjs.send("service_ckmdd7c", "template_sn9nh14", {
      from_name: "Mueblería Valadez",
      to_name: "estimado cliente",
      subject: "Subscripción al Newsletter",
      message: "¡Muchas gracias por su confianza!",
      from_email: this.form.value.from_email,
    });

    //console.log(response);
    Swal.fire({
      title: '¡Muchas gracias!',
      text: 'Se ha registrado correctamente a nuestro newsletter. Agradecemos su confianza.',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#28a745', // Color verde para el botón de éxito
      confirmButtonText: 'Aceptar',
      customClass: {
        confirmButton: 'btn-success' // Agrega la clase 'btn-success' al botón de éxito
      }
    });

    this.form.reset();
  }
}
