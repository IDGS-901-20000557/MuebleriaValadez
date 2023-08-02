import { Component } from '@angular/core';
import { CarritoComprasService } from '../carrito-compras.service';
import { Producto } from '../productos-pedido/interfaces/product.interface';
import { PedidoService } from '../productos-pedido/services/pedido.service';
import { TarjetaService } from '../productos-pedido/services/cards.service';
import { Tarjeta } from '../productos-pedido/interfaces/card.interface';
import { Observable } from 'rxjs';
import { DireccionService } from '../productos-pedido/services/address.service';
import { Direccion } from '../productos-pedido/interfaces/address.interface';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  cartItems: Producto[] = [];
  isDivVisible!: boolean ;

  constructor(private cartService: CarritoComprasService, 
              private pedidoService: PedidoService,
              private tarjetaService: TarjetaService,
              private direccionesService: DireccionService) {
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

  showHideCart(): void {
    this.isDivVisible = !this.isDivVisible;
  }
}