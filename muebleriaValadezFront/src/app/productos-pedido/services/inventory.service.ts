import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../interfaces/inventory.interface';

@Injectable({
  providedIn: 'root'
})

export class InventarioService {  
    private apiUrl = 'https://localhost:7010/api/Inventario'; 
    
    constructor(private http: HttpClient) { }
    
    getAllInventario(): Observable<Inventario[]> {
        return this.http.get<Inventario[]>(`${this.apiUrl}/GetAll`);
    }
    
    getInventoryById(id: number): Observable<Inventario> {
        return this.http.get<Inventario>(`${this.apiUrl}/${id}`);
    }
}
