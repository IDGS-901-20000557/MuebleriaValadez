import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(private router: Router) {

  }
  menuPrincipal(): boolean {
    return sessionStorage.getItem('idRol') === null;
  }
  menuAdministrador(): boolean {
    if (sessionStorage.getItem('idRol') !== null && sessionStorage.getItem('idRol') ==='1') {
    return true;
    }else{
      return false;
    }
  }
  menuCliente(): boolean {
    if (sessionStorage.getItem('idRol') !== null && sessionStorage.getItem('idRol') ==='3') {
      return true;
      }else{
        return false;
      }
  }
  menuEmpleadoPedidos(): boolean {
    if (sessionStorage.getItem('idRol') !== null && sessionStorage.getItem('idRol') ==='10002') {
      return true;
      }else{
        return false;
      }
  }
  menuEmpleadoVentas(): boolean {
    if (sessionStorage.getItem('idRol') !== null && sessionStorage.getItem('idRol') ==='2') {
      return true;
      }else{
        return false;
      }
  }
  logOut(): void {
sessionStorage.removeItem('idUsuario');
sessionStorage.removeItem('idCliente');
sessionStorage.removeItem('idEmpleado');
sessionStorage.removeItem('email');
sessionStorage.removeItem('nombre');
sessionStorage.removeItem('idPersona');
sessionStorage.removeItem('idDireccionSucursal');
sessionStorage.removeItem('idRol');
sessionStorage.removeItem('rfc');
sessionStorage.removeItem('rol');
sessionStorage.removeItem('sucursal');
sessionStorage.removeItem('telefono');
this.router.navigateByUrl('/auth');
  }
}
