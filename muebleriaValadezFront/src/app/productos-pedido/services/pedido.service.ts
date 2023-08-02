import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../interfaces/pedido.interface';
import { OrdenPedido } from '../interfaces/ordenPedido.interface';
import { Producto } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})

export class PedidoService { 
    constructor(private http: HttpClient) {}

    apiPedidos = 'https://localhost:7010/api/Pedido';

    getAllPedidosCliente(idCliente:number): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(this.apiPedidos+'/'+idCliente);
    }

    getAllOrdenPedido(idPedido:number): Observable<any[]> {
        return this.http.get<any[]>(this.apiPedidos+'/ObtenerDetalle/'+idPedido);
    }

    addPedidoOrden(producto:Producto, idUsuario:number, idClientes:number, cantidadS:number, idTarjeta:number, IdDireccion:number) {
        // Genera un codigo aleatorio de 3 digitos
        const codigoAleatorio = Math.floor(Math.random() * 100000);
        const codigoBD = codigoAleatorio.toString().padStart(3, '0');
        const body = {
            "pedido": {
            "IdCliente" : idClientes,
            "IdTarjeta":idTarjeta,
            "fechaPedido":new Date(),
            "codigo": codigoBD,
            "total": (producto.precioVenta*cantidadS),
            "IdDireccion":IdDireccion,
            "estatus":'1'
            },
            "ordenPedido": {
            "cantidad":cantidadS,
            "IdProducto":producto.idProducto,
            }
        };
        // Hace el post al api para agregar el pedido y regresa el pedidoDetalle en JSON
        return this.http.post(this.apiPedidos+'/AgregarPedidoOrden/'+producto.precioVenta+'&&'+idUsuario, 
                                    body).toPromise();
    }

    addPedido(totalS:number, idClientes:number, idTarjeta:number, IdDireccion:number){
        const codigoAleatorio = Math.floor(Math.random() * 100000);
        // Genera un codigo aleatorio de 3 digitos
        const codigoBD = codigoAleatorio.toString().padStart(3, '0');
        // Se crea el objeto pedido
        var pedido : Pedido = {
            IdPedido:0,
            IdCliente : idClientes,
            IdTarjeta:idTarjeta,
            fechaPedido:new Date(),
            fechaEntrega:new Date(),
            codigo: codigoBD,
            total: totalS,
            idDireccion:IdDireccion,
            IdEmpleadoEntrega:0,
            estatus:'1'
        };
        // Hace el post al api para agregar el pedido y regresa el pedido en JSON
        return this.http.post(this.apiPedidos+'/AgregarPedido/'+sessionStorage.getItem('idUsuario'), pedido).toPromise();
    }

    addOrden(producto: Producto, cantidadR: number){
        var idUsuario = sessionStorage.getItem('idUsuario');
        var ordenPedido : OrdenPedido = {
            IdOrdenPedido:0,
            cantidad:cantidadR,
            subtotal:0,
            IdProducto:producto.idProducto,
            IdPedido:0
        };

        return this.http.post<any>(this.apiPedidos+'/AgregarOrden/'+producto.precioVenta+'&&'+idUsuario, ordenPedido).toPromise();
    }

}