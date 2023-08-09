import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoComprasService } from '../carrito-compras.service';
import { Producto } from '../productos-pedido/interfaces/product.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(private router: Router, 
              private cartService: CarritoComprasService) {
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
  /* Funciones para el botón de carrito en el menu cliente*/
  cartItems: Producto[] = this.cartService.getCartItems();

  removeOneCart(item : Producto):void{
      this.cartService.removeOne(item);
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  checkSession(){
    if(sessionStorage.getItem('idUsuario') == null){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes iniciar sesión para poder realizar tu pedido',
        timer: 5000,
        didClose() {
          window.location.href = '/auth';
        }
      });
      return false;
    }else{
      return true;
    }
  }

}
