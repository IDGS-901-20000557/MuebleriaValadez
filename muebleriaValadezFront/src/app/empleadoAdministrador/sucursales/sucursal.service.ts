import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sucursal } from './sucursal';

@Injectable({
  providedIn: 'root'
})

export class SucursalService {
  private apiUrl = 'https://localhost:7010/api/Sucursal'; // URL de la API Sucursales

  constructor(private http: HttpClient) { }

  // Método para obtener todos las sucursales
  getAllSucursales(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(this.apiUrl);
  }

  // Método para obtener la lista de estados
  getEstados(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/getEstados`);
  }

  // Método para obtener todas las ciudades en función del estado seleccionado
  getCiudadesByEstado(estado: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/getCiudades?estado=${estado}`);
  }

  // Método para obtener todos los códigos postales en función de la ciudad seleccionada
  getCodigosPostalesByCiudad(ciudad: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/getCp?ciudad=${ciudad}`);
  }

  getColoniasByCodigoPostal(cp: number): Observable<any[]> {
    return this.http.get<string[]>(`${this.apiUrl}/getColonia?cp=${cp}`);
  }

  // Método para insertar una sucursal
  insertSucursal(sucursal: Sucursal, idUsuario: number, idDomicilio: number): Observable<Sucursal> {
    return this.http.post<Sucursal>(`${this.apiUrl}/${idUsuario}/${idDomicilio}`, sucursal);
  }

  // Método para actualizar una sucursal
  updateSucursal(id: number, sucursal: Sucursal, idUsuario: number, idDireccion: number, idDomicilio: number): Observable<Sucursal> {
    return this.http.put<Sucursal>(`${this.apiUrl}/${id}/${idUsuario}/${idDireccion}/${idDomicilio}`, sucursal);
  }

  // Método para eliminar una sucursal por su Id
  deleteSucursal(id: number, idUsuario: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/${idUsuario}`);
  }

}
