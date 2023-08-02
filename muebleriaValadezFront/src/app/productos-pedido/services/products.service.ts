import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {  
    // URL de la API Productos
    private apiUrl = 'https://localhost:7010/api/Productos'; 
    
    constructor(private http: HttpClient) { }
    
    // Método para obtener todos los productos
    getAllProducts(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.apiUrl);
    }
    
    // Método para obtener un producto por su Id
    getProductById(id: number): Observable<Producto> {
        return this.http.get<Producto>(`${this.apiUrl}/${id}`);
    }
}
