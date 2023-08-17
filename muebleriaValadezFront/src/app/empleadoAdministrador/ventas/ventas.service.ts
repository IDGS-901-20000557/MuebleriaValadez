import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable } from 'rxjs';
import { Producto } from './producto';
import { OrdenVenta } from './orden-venta';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  constructor(private http: HttpClient) { }
  getAllClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>('https://localhost:7010/api/Ventas/getCliente');
  }

  insertVenta(ordenVenta: OrdenVenta) {

    const body = {
      total: ordenVenta.total,
      idCliente: ordenVenta.idCliente,
      idUsuario: ordenVenta.IdUsuario,
      idDireccion: ordenVenta.IdDireccion,
      idEmpleadoMostrador: ordenVenta.IdEmpleadoMostrador,
      tipoPago: ordenVenta.tipoPago,
      productosVenta: ordenVenta.productosVenta,
    };
    const apiUrl = 'https://localhost:7010/api/Ventas/insertOrdenVenta';
    return this.http.post(apiUrl, body, { responseType: 'text' }).toPromise();
  }

  updateVenta(ordenVenta: OrdenVenta) {

    const body = {
      idOrdenVenta: ordenVenta.idOrdenVenta,
      total: ordenVenta.total,
      idCliente: ordenVenta.idCliente,
      idUsuario: ordenVenta.IdUsuario,
      idDireccion: ordenVenta.IdDireccion,
      idEmpleadoMostrador: ordenVenta.IdEmpleadoMostrador,
      tipoPago: ordenVenta.tipoPago,
      productosVenta: ordenVenta.productosVenta,
    };
    const apiUrl = `https://localhost:7010/api/Ventas/modificarOrdenVenta`;
    return this.http.put(apiUrl, body, { responseType: 'text' }).toPromise();
  }

  getAllVentas(): Observable<OrdenVenta[]> {
    return this.http.get<OrdenVenta[]>('https://localhost:7010/api/Ventas');
  }

  deleteVenta(idUsuario: number, idVenta: number): Observable<string> {
    const url = `https://localhost:7010/api/Ventas/${idVenta}/${idUsuario}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  getVenta(id: number): Observable<OrdenVenta> {
    const url = `https://localhost:7010/api/Ventas/${id}`;
    return this.http.get<OrdenVenta>(url);
  }

  getAllProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>('https://localhost:7010/api/Productos');
  }

  signUp(nombre: string, apellidoP: string, apellidoM: string, telefono: string,email: string, password: string) {
    const apiUrl = 'https://localhost:7010/auth/Auth';
    const body = {
      "email": email,
      "password": password,
    "persona":{
      "nombres": nombre,
    "apellidoPaterno": apellidoP,
    "apellidoMaterno": apellidoM,
    "telefono": telefono
    }};

    return this.http.post(apiUrl, body, { responseType: 'text' }).toPromise();
  }
  userFind(email: string) {
    const apiUrl = 'https://localhost:7010/auth/Auth/userFind';
    const body = {
      "email": email
    };
    return this.http.post(apiUrl, body, { responseType: 'text' }).toPromise();
  }

  entregarVentaProducto(venta: OrdenVenta) {
    const body = {
      idUsuario: venta.IdUsuario,
      idEmpleadoMostrador: venta.IdEmpleadoMostrador,
      idOrdenVenta: venta.idOrdenVenta,
      productosVenta: venta.productosVenta
    };
    const apiUrl = 'https://localhost:7010/api/Ventas/entregarOrdenVenta';
    return this.http.post(apiUrl, body, { responseType: 'text' }).toPromise();
  }

}
