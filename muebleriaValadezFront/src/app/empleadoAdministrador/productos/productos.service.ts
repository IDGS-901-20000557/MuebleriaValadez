import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insumo } from './insumo';
import { LibroReceta } from './libro-receta';
import { Producto } from './producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  constructor(private http: HttpClient) { }
  getAllInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>('https://localhost:7010/api/Insumo');
  }
  getAllProductos(): Observable<Insumo[]> {
    return this.http.get<Producto[]>('https://localhost:7010/api/Productos');
  }

  insertProducto(libroReceta: LibroReceta) {

    const body = {
      insumosLibroRecetas: libroReceta.insumosLibroRecetas,
      productoLibroRecetas: libroReceta.productoLibroRecetas,
      idUsuario: libroReceta.idUsuario,
      idSucursal: libroReceta.idSucursal
    };
    const apiUrl = 'https://localhost:7010/api/Productos';
    return this.http.post(apiUrl, body, { responseType: 'text' }).toPromise();
  }

  updateProducto(libroReceta: LibroReceta) {

    const body = {
      idLibroReceta: 0,
      insumosLibroRecetas: libroReceta.insumosLibroRecetas,
      productoLibroRecetas: libroReceta.productoLibroRecetas,
      idUsuario: libroReceta.idUsuario,
    };
    const apiUrl = `https://localhost:7010/api/Productos/${libroReceta.productoLibroRecetas?.idProducto}`;
    return this.http.put(apiUrl, body, { responseType: 'text' }).toPromise();
  }

   // Método para obtener un libro de receta por su ID
   getLibroReceta(id: number): Observable<LibroReceta> {
    const url = `https://localhost:7010/api/Productos/${id}`;
    return this.http.get<LibroReceta>(url);
  }

  deleteLibroReceta(idProducto: number, idUsuario: number): Observable<string> {
    const url = `https://localhost:7010/api/Productos/${idProducto}/${idUsuario}`;
    return this.http.delete(url, { responseType: 'text' });
  }
}
