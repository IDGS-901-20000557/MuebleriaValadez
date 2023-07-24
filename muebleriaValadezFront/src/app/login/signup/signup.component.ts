import { Component, ElementRef, ViewChild, Renderer2  } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(private renderer: Renderer2) {}

  isPasswordVisible = false;
  @ViewChild('asIcon') icono!: ElementRef;
  @ViewChild('asPassword') password!: ElementRef;

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
