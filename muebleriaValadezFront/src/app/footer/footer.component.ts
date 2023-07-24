import { Component } from '@angular/core';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  newsletter() {
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
  }
}
