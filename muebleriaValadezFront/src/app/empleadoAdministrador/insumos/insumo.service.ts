import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insumo } from './insumo';

@Injectable({
  providedIn: 'root'
})

export class InsumoService {
  private apiUrl = 'https://localhost:7010/api/Insumo'; // URL de la API Insumos

  constructor(private http: HttpClient) { }

  // Método para obtener todos los insumos
  getAllInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.apiUrl);
  }

  // Método para obtener todos los proveedores
  getAllProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proveedores`);
  }

  // Método para obtener un insumo por su Id
  getInsumoById(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.apiUrl}/${id}`);
  }

  // Método para insertar un insumo
  insertInsumo(insumo: Insumo, idProveedor: number, idUsuario: number, idSucursal: number): Observable<Insumo> {
    insumo.idProveedor = idProveedor;
    return this.http.post<Insumo>(`${this.apiUrl}/${idUsuario}/${idSucursal}`, insumo);
  }

  // Método para actualizar un insumo
  updateInsumo(id: number, insumo: Insumo, idUsuario: number): Observable<Insumo> {
    return this.http.put<Insumo>(`${this.apiUrl}/${id}/${idUsuario}`, insumo);
  }

  // Método para eliminar un insumo por su Id
  deleteInsumo(id: number, idUsuario: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/${idUsuario}`);
  }
  
}
