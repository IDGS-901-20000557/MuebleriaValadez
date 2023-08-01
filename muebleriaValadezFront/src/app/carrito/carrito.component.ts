import { Component } from '@angular/core';
import { CarritoComprasService } from '../carrito-compras.service';
import { Producto } from '../productos-pedido/product.interface';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  cartItems: Producto[] = [];
  isDivVisible!: boolean ;

  constructor(private cartService: CarritoComprasService) {
    this.cartItems = this.cartService.getCartItems();
  }
  removeOneCart(item:Producto):void{
      this.cartService.removeOne(item);
  }

  removeProduct(item:Producto):void{
    this.cartService.removeItem(item);
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

}
