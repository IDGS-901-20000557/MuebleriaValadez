import { Component } from '@angular/core';
import { PedidoService } from '../productos-pedido/services/pedido.service';
import { Pedido } from '../productos-pedido/interfaces/pedido.interface';
import { Observable } from 'rxjs';
import { DireccionService } from '../productos-pedido/services/address.service';
import { Direccion } from '../productos-pedido/interfaces/address.interface';
import { OrdenPedido } from '../productos-pedido/interfaces/ordenPedido.interface';
import { Producto } from '../productos-pedido/interfaces/product.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent {
  constructor(private pedidosServices : PedidoService,
              private direccionService: DireccionService) {
    this.getAllPedidosCliente();
  }
  direcciones!:Observable<Direccion[]>;
  pedidos!:Observable<Pedido[]> ;
  ordenPedidos!:Observable<OrdenPedido[]>;
  productosOrden!:Observable<Producto[]>;

  getAllPedidosCliente(){
    var idCliente = sessionStorage.getItem('idCliente');
    // Si no existe, se asigna 0 y se convierte a numero
    const idCl = idCliente!== null ? parseInt(idCliente, 10) : 0;
    this.pedidos = this.pedidosServices.getAllPedidosCliente(idCl)
    this.direcciones = this.direccionService.getAllDireccionesCliente(idCl);
  }

  getDetallePedido(idPedido:number){
    this.ordenPedidos = this.pedidosServices.getAllOrdenPedido(idPedido);
    this.productosOrden = this.pedidosServices.getAllProductosOrden(idPedido);
  }

  cancelPedido(idPedido:number){
    Swal.fire({
      title: '¿Estas seguro de cancelar el pedido?',
      text: "No podras revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, cancelar pedido',
      cancelButtonText: 'No, regresar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidosServices.cancelarPedido(idPedido).then((data)=>{
          Swal.fire(
            '¡Pedido cancelado!',
            'El pedido ha sido cancelado.',
            'success'
          )
          this.getAllPedidosCliente();
        }).catch((error)=>{
          Swal.fire(
            '¡Error!',
            'El pedido no ha sido cancelado.',
            'error'
          )
        });
      }else{
        Swal.fire(
          'Accion cancelada',
          'Puedes seguir viendo tus pedidos.',
          'info'
        )
      }
    })
  }
}
