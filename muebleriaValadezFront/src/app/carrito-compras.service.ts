/* /*
  25-Julio-2023
  Clase desarrollada por Jonathan
  Servicio para el uso de carrito de compras en el componente producto-pedido
*/

import { Injectable } from '@angular/core';
import { Producto } from './productos-pedido/interfaces/product.interface';
import Swal from 'sweetalert2';
import { Inventario } from './productos-pedido/interfaces/inventory.interface';

@Injectable({
  providedIn: 'root'
})
export class CarritoComprasService {
  private cartItems: Producto[] = [];

  addToCart(item: Producto, invent: Inventario): void {
    const existingItem = this.cartItems.find((product) => product.idProducto === item.idProducto);
    if (existingItem) {
      if(existingItem.cantidad >= invent.cantidaDisponible){
        Swal.fire({
          icon: 'error',
          title: 'No se puede agregar al carrito',
          text: 'Por el momento, solo puedes agregar hasta '+invent.cantidaDisponible+' '+item.nombreProducto+' al carrito',
        });
      }else{
      existingItem.cantidad++;
      }
    } else {
      this.cartItems.push({ ...item, cantidad: 1 });
      Swal.fire({
        icon: 'success',
        title: 'Agregado al carrito',
        text: 'Agregaste '+item.nombreProducto+' al carrito',
      });
    }
  }

  
removeOne(item: Producto): void {
  const existingItemIndex = this.cartItems.findIndex(product => product.idProducto === item.idProducto);

  if (existingItemIndex !== -1) {
    const existingItem = this.cartItems[existingItemIndex];

    if (existingItem.cantidad > 0) {
      existingItem.cantidad--;

      if (existingItem.cantidad <= 0) {
        this.removeFromCart(existingItemIndex);
      }
    }
  }
}

removeFromCart(index: number): void {
  this.cartItems.splice(index, 1);
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
