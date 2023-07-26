import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Aquí verificamos si el usuario está autenticado
    // Puedes adaptar esta lógica según cómo almacenes la información de autenticación
    const isAuthenticated = sessionStorage.getItem('idRol') !== null;
    const userRole = sessionStorage.getItem('idRol');
    console.log(userRole);
    console.log(userRole?.toString()==='1');
    console.log(userRole?.toString());
    console.log(isAuthenticated);
    console.log(isAuthenticated && userRole?.toString()==='1');
    if (isAuthenticated && userRole?.toString()==='1') {
      return true; // Permite la activación de la ruta
    } else {
      // Si el usuario no está autenticado, redirige a la página de autenticación
      this.router.navigate(['/auth']);
      return false; // Impide la activación de la ruta
    }
  }
}
