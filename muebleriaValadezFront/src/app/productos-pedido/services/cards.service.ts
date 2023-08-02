import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarjeta } from '../interfaces/card.interface';


@Injectable({
  providedIn: 'root'
})

export class TarjetaService {
    constructor(private http: HttpClient) {}

    apiTarjetas = 'https://localhost:7010/api/Tarjeta';

    getTarjetasCliente(idCliente:number): Observable<Tarjeta[]> {
        return this.http.get<Tarjeta[]>(this.apiTarjetas+'/'+idCliente);
    }
} 