import { Component } from '@angular/core';
import { Producto } from './product.interface';
import { CarritoComprasService } from '../carrito-compras.service';

@Component({
  selector: 'app-productos-pedido',
  templateUrl: './productos-pedido.component.html',
  styleUrls: ['./productos-pedido.component.css']
})
export class ProductosPedidoComponent {
  isDivVisible: boolean = false;
  products: Producto[] = [
    { id: 1, 
      nombre: 'Base Para Television',
      descripcion: 'Mueble de madera maciza rustica', 
      foto:'https://www.ohcielos.com/images/mueble-tv-madera-maciza-rustica-52233.jpg',
      costoProduccion:120,
      precioVenta: 102, 
      cantidadAceptable:1,
      cantidad: 5},
    { id: 2, 
      nombre: 'Bar De Madera',
      descripcion: 'Mueble bar de madera teca de 100x85-170 (abierto)x40cm. Rococó', 
      foto:'https://mirococo.com/wp-content/uploads/2020/04/RC-XII19-038-1.jpg',
      costoProduccion:120,
      precioVenta: 200, 
      cantidadAceptable:1,
      cantidad: 10 }
  ];

  constructor(private cartService: CarritoComprasService) {}

  addToCart(item: Producto): void {
    this.cartService.addToCart(item);
  }
  showHideCart(): void {
    this.isDivVisible = !this.isDivVisible;
  }
}
