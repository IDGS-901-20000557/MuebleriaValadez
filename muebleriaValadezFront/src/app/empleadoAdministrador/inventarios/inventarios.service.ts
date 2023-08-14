import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insumo } from './insumo';
import { Producto } from './producto';
import { Lote } from './lote';
import { Inventario } from './inventario';

@Injectable({
  providedIn: 'root'
})
export class InventariosService {

  constructor(private http: HttpClient) { }
  getAllInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>('https://localhost:7010/api/Insumo');
  }
  getAllProductos(): Observable<Insumo[]> {
    return this.http.get<Producto[]>('https://localhost:7010/api/Productos');
  }
  getAllLotes(): Observable<Lote[]> {
    return this.http.get<Lote[]>('https://localhost:7010/api/Inventario');
  }

  getAllInventario(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>('https://localhost:7010/api/Inventario/getInventario');
  }

  // Método para obtener un libro de receta por su ID
  getLote(id: number): Observable<Lote> {
    const url = `https://localhost:7010/api/Inventario/${id}`;
    return this.http.get<Lote>(url);
  }

  deleteLote(idLote: number, idUsuario: number): Observable<string> {
    const url = `https://localhost:7010/api/Inventario/${idLote}/${idUsuario}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  insertLoteInsumo(lote: Lote) {

    const body = {
      noLote: lote.noLote,
      observaciones: lote.observaciones,
      idSucursal: lote.idSucursal,
      idUsuario: lote.idUsuario,
      costo: lote.costo,
      insumosLote: lote.insumosLote
    };
    const apiUrl = 'https://localhost:7010/api/Inventario/insertLoteInsumo';
    return this.http.post(apiUrl, body, { responseType: 'text' }).toPromise();
  }

  insertLoteProducto(lote: Lote) {

    const body = {
      noLote: lote.noLote,
      observaciones: lote.observaciones,
      idSucursal: lote.idSucursal,
      idUsuario: lote.idUsuario,
      costo: lote.costo,
      productosLote: lote.productosLote
    };
    const apiUrl = 'https://localhost:7010/api/Inventario/insertLoteProducto';
    return this.http.post(apiUrl, body, { responseType: 'text' }).toPromise();
  }

  entregarLoteInsumo(lote: Lote) {

    const body = {
      idLote: lote.idLote,
      idUsuario: lote.idUsuario,
      insumosLote: lote.insumosLote
    };
    const apiUrl = 'https://localhost:7010/api/Inventario/entregarLoteInsumo';
    return this.http.post(apiUrl, body, { responseType: 'text' }).toPromise();
  }

  entregarLoteProducto(lote: Lote) {
    const body = {
      idLote: lote.idLote,
      idUsuario: lote.idUsuario,
      productosLote: lote.productosLote
    };
    const apiUrl = 'https://localhost:7010/api/Inventario/entregarLoteProducto';
    return this.http.post(apiUrl, body, { responseType: 'text' }).toPromise();
  }

  updateLoteInsumo(lote: Lote) {

    const body = {
      idLote: lote.idLote,
      noLote: lote.noLote,
      observaciones: lote.observaciones,
      idSucursal: lote.idSucursal,
      idUsuario: lote.idUsuario,
      costo: lote.costo,
      insumosLote: lote.insumosLote
    };
    const apiUrl = `https://localhost:7010/api/Inventario/modificarLoteInsumo`;
    return this.http.put(apiUrl, body, { responseType: 'text' }).toPromise();
  }

  updateLoteProducto(lote: Lote) {

    const body = {
      idLote: lote.idLote,
      noLote: lote.noLote,
      observaciones: lote.observaciones,
      idSucursal: lote.idSucursal,
      idUsuario: lote.idUsuario,
      costo: lote.costo,
      productosLote: lote.productosLote
    };
    const apiUrl = `https://localhost:7010/api/Inventario/modificarLoteProducto`;
    return this.http.put(apiUrl, body, { responseType: 'text' }).toPromise();
  }


}
