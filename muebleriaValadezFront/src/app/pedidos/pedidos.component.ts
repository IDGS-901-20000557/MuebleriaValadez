import { Component } from '@angular/core';
import { PedidoService } from '../productos-pedido/services/pedido.service';
import { Pedido } from '../productos-pedido/interfaces/pedido.interface';
import { Observable } from 'rxjs';
import { DireccionService } from '../productos-pedido/services/address.service';
import { Direccion } from '../productos-pedido/interfaces/address.interface';

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

  getAllPedidosCliente(){
    var idCliente = sessionStorage.getItem('idCliente');
    // Si no existe, se asigna 0 y se convierte a numero
    const idCl = idCliente!== null ? parseInt(idCliente, 10) : 0;
    this.pedidos = this.pedidosServices.getAllPedidosCliente(idCl)
    this.direcciones = this.direccionService.getAllDireccionesCliente(idCl);
  }
}
