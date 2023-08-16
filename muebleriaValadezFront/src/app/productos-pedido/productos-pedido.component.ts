import { Component, ElementRef, ViewChild } from '@angular/core';
import { Producto } from './interfaces/product.interface';
import { Inventario } from './interfaces/inventory.interface';
import { ProductsService } from './services/products.service';
import { InventarioService } from './services/inventory.service';

import { Observable } from 'rxjs';
import { CarritoComprasService } from '../carrito-compras.service';
import { PedidoService } from './services/pedido.service';
import { DireccionService } from './services/address.service';
import { TarjetaService } from './services/cards.service';
import { Tarjeta } from './interfaces/card.interface';
import Swal from 'sweetalert2';
import { Direccion } from './interfaces/address.interface';

@Component({
  selector: 'app-productos-pedido',
  templateUrl: './productos-pedido.component.html',
  styleUrls: ['./productos-pedido.component.css'],
})
export class ProductosPedidoComponent {
  isDivVisible: boolean = false;

  constructor(
    private cartService: CarritoComprasService,
    private prodService: ProductsService,
    private inventarioService: InventarioService,
    private pedidoService: PedidoService,
    private direccionesService: DireccionService,
    private tarjetaService: TarjetaService,
    private carritoService: CarritoComprasService
  ) {
  }

  // Variables para guardar los datos del producto, tarjeta, cantidad y direccion seleccionados
  productoS: Producto = {
    idProducto: 0,
    nombreProducto: '',
    descripcion: '',
    precioVenta: 0,
    foto: '',
    cantidad: 0,
    cantidadAceptable: 0,
    costoProduccion: 0,
    idInventario: 0
  };
  // Variable para guardar la cantidad de productos a comprar
  cantidadS: number = 1;
  // Variable para guardar el total de la compra
  totalS !: number ;
  // Variable para guardar el id de la tarjeta y la direccion seleccionadas
  direccionS!: number;
  tarjetaS!: number;
  // Variable para guardar el total del pedido almacenado en el sessionStorage
  totalC:number = sessionStorage.getItem('totalPedido') ? parseFloat(sessionStorage.getItem('totalPedido') ?? '0') : 0;

  // Variable para obtener el carrito de compras
  cartItems: Producto[] = this.cartService.getCartItems();

  // Variable para obtener el Id del cliente del sessionStorage
  // Si no existe, se asigna 0
  // El 10 representa la base decimal
  idCliente = parseInt(sessionStorage.getItem('idCliente') ?? '0', 10);
  // Obtiene una lista de productos e inventario de la base de datos
  products$: Observable<Producto[]> = this.prodService.getAllProducts();
  inventory$: Observable<Inventario[]> =
    this.inventarioService.getAllInventario();

  // Obtiene una lista de tarjetas y direcciones del cliente
  cards$: Observable<Tarjeta[]> = this.tarjetaService.getTarjetasCliente(
    this.idCliente
  );
  addresses$: Observable<Direccion[]> =
    this.direccionesService.getAllDireccionesCliente(this.idCliente);

  addToCart(item: Producto, inventory : Inventario): void {
    this.cartService.addToCart(item, inventory);
    sessionStorage.setItem('totalPedido', this.carritoService.getTotal().toString());
  }
  showHideCart(): void {
    this.isDivVisible = !this.isDivVisible;
  }

  setTotal(): void {
    this.totalS = this.productoS.precioVenta*this.cantidadS;
  }

  checkSession(){
    if(sessionStorage.getItem('idUsuario') == null){
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'Debes iniciar sesión para poder realizar tu pedido',
        timer: 5000,
      });
    }
    window.location.href = '/auth';
  }

  isLoggedIn(){
    if(sessionStorage.getItem('idCliente') == null){
      return false;
    }else{
      return true;
    }
  }

  checkData(product : Producto): void {
    this.productoS = product;
    this.totalS = this.productoS.precioVenta*this.cantidadS;
    this.cards$.subscribe((tarjetas: Tarjeta[]) => {
      if (tarjetas.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No tienes tarjetas registradas, por favor registra una tarjeta para poder realizar tu pedido',
          timer: 5000,
        });
      }

      this.addresses$.subscribe((adress: Direccion[]) => {
        if (adress.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No tienes direcciones ni tarjetas registradas, '+
            'por favor registralas en el modulo administrar cuenta para poder realizar tu pedido',
            timer: 5000,
          });
        }
      });
    });
  }

  getTotalCart(): number {
    return this.cartService.getTotal();
  }

  addToOrderDet(): void {
    // Obtiene el id del usuario y del cliente del sessionStorage
    var idUsuario = sessionStorage.getItem('idUsuario');
    var idCliente = sessionStorage.getItem('idCliente');
    // Si no existe, se asigna 0 y se convierte a numero
    const idUs = idUsuario!== null ? parseInt(idUsuario, 10) : 0;
    // Si no existe, se asigna 0 y se convierte a numero
    const idCl = idCliente!== null ? parseInt(idCliente, 10) : 0;
    // Agrega el pedido a la tabla de pedidos
   this.pedidoService.addPedidoOrden(this.productoS, idUs, idCl, this.cantidadS, this.tarjetaS, this.direccionS)
   .then((response: any) => {
    Swal.fire({
      icon: 'success',
      title: '¡Pedido realizado con éxito!',
      text: 'Tu pedido se ha realizado con éxito.',
      timer: 5000,
    });
    
        })
        .catch((error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al realizar tu pedido, por favor intenta de nuevo',
            timer: 5000,
          });
        }); 
  }

  async doManyOrders(): Promise<void> {
    const idUsuario = sessionStorage.getItem('idUsuario');
    const idCliente = sessionStorage.getItem('idCliente');
    const idUs = idUsuario !== null ? parseInt(idUsuario, 10) : 0;
    const idCl = idCliente !== null ? parseInt(idCliente, 10) : 0;
    const total = this.cartService.getTotal();
  
    try {
      const pedidoResponse = await this.pedidoService.addPedido(total, idCl, this.tarjetaS, this.direccionS);
      this.cartItems = this.cartService.getCartItems();
      let errors = 0;
  
      for (const producto of this.cartItems) {
        try {
          const ordenResponse = await this.pedidoService.addOrden(producto, producto.cantidad);
        } catch (error) {
          errors++;
        }
      }
  
      if (errors === 0) {
        Swal.fire({
          icon: 'success',
          title: '¡Pedido realizado con éxito!',
          text: 'Tu pedido se ha realizado con éxito.',
          timer: 5000,
        });
        
      } else {
        console.log(errors);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hubo un error al realizar tu pedido, por favor intenta de nuevo',
          timer: 5000,
        });
      }
  
      this.cartService.cleanCart();
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al realizar tu pedido, por favor intenta de nuevo',
        timer: 5000,
      });
    }
  }
  


}
