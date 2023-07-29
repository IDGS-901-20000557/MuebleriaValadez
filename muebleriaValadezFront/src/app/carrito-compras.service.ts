/* /*
  25-Julio-2023
  Clase desarrollada por Jonathan
  Servicio para el uso de carrito de compras en el componente producto-pedido
*/

import { Injectable } from '@angular/core';
import { Producto } from './productos-pedido/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CarritoComprasService {
  private cartItems: Producto[] = [];

  addToCart(item: Producto): void {
    const existingItem = this.cartItems.find((product) => product.id === item.id);
    if (existingItem) {
      if(existingItem.cantidad < item.cantidad){
      existingItem.cantidad++;
    }else{
      alert('Solo puedes agregar hasta '+item.cantidad+' piezas de este mueble')
    }
    } else {
      this.cartItems.push({ ...item, cantidad: 1 });
      alert('Agregaste '+item.nombre+' al carrito');
    }
  }

  removeOne(item:Producto):void{
    
      const existingItem = this.cartItems.find((product) => product.id === item.id);
      if (existingItem) {
        existingItem.cantidad--;
        if (existingItem.cantidad == 0) {
          this.cartItems = this.cartItems.filter((product) => product.id !== item.id);
        }
      }
  }

  removeItem(item:Producto):void{
    const existingItem = this.cartItems.find((product) => product.id === item.id);
      if (existingItem) {
          let existingItemIndex = this.cartItems.findIndex((product) => product.id === item.id);
          this.cartItems = this.cartItems.splice(existingItemIndex, 1);
        }
  }
  

  getCartItems(): Producto[] {
    return this.cartItems;
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.precioVenta * item.cantidad, 0);
  }
}
