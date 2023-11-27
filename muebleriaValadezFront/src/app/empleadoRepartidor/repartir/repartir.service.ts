import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Repartir } from './repartir';
import { RepartirDetalle } from './repartirDetalle';

@Injectable({
  providedIn: 'root',
})
export class RepartirService {
  constructor(private http: HttpClient) {}

  getAllRepartir(): Observable<Repartir[]> {
    return this.http.get<Repartir[]>('https://localhost:7010/api/Repartidor');
  }

  // Método para obtener un libro de receta por su ID
  getDetalleRepartir(id: number): Observable<RepartirDetalle> {
    const url = `https://localhost:7010/api/Repartidor/${id}`;
    return this.http.get<RepartirDetalle>(url);
  }

  entregarRepartir(idPedido: number, idEmpleado: number, idUsuario: number) {
    const body = {
      idPedido: idEmpleado,
      nombreCliente: 'string',
      domicilio: 'string',
      fechaPedido: '2023-11-26T23:24:44.756Z',
      codigo: 0,
      total: 0,
      productoRepartir: [
        {
          idProducto: 0,
          nombreProducto: 'string',
          cantidad: 0,
        },
      ],
    };
    return this.http
      .put(
        `https://localhost:7010/api/Repartidor/${idPedido}/${idUsuario}`,
        body,
        { responseType: 'text' }
      )
      .toPromise();
  }
}
