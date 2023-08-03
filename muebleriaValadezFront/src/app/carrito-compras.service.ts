/* /*
  25-Julio-2023
  Clase desarrollada por Jonathan
  Servicio para el uso de carrito de compras en el componente producto-pedido
*/

import { Injectable } from '@angular/core';
import { Producto } from './productos-pedido/interfaces/product.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CarritoComprasService {
  private cartItems: Producto[] = [];

  addToCart(item: Producto): void {
    const existingItem = this.cartItems.find((product) => product.idProducto === item.idProducto);
    if (existingItem) {
      existingItem.cantidad++;
    } else {
      this.cartItems.push({ ...item, cantidad: 1 });
      Swal.fire({
        icon: 'success',
        title: 'Agregado al carrito',
        text: 'Agregaste '+item.nombreProducto+' al carrito',
      });
    }
  }

  removeOne(item:Producto):void{
    
      const existingItem = this.cartItems.find((product) => product.idProducto === item.idProducto);
      if (existingItem) {
        existingItem.cantidad--;
        if (existingItem.cantidad == 0) {
          this.cartItems = this.cartItems.filter((product) => product.idProducto !== item.idProducto);
        }
      }
  }

  removeItem(item:Producto):void{
    const existingItem = this.cartItems.find((product) => product.idProducto === item.idProducto);
      if (existingItem) {
          let existingItemIndex = this.cartItems.findIndex((product) => product.idProducto === item.idProducto);
          this.cartItems = this.cartItems.splice(existingItemIndex, 1);
        }
  }

  getCartItems(): Producto[] {
    return this.cartItems;
  }

  cleanCart(): void {
    this.cartItems = [];
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.precioVenta * item.cantidad, 0);
  }
}
