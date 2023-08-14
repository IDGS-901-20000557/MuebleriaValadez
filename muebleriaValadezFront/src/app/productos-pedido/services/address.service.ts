import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Direccion } from '../interfaces/address.interface';


@Injectable({
  providedIn: 'root'
})

export class DireccionService {
    constructor(private http: HttpClient) {}

    apiDirecciones = 'https://localhost:7010/api/Direccion';

    getAllDireccionesCliente(idCliente:number): Observable<Direccion[]> {
        return this.http.get<Direccion[]>(this.apiDirecciones+'/'+idCliente);
    }
} 