import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable , map} from 'rxjs';
import { InventarioInsumos, InventarioProductos, MejoresClientes, MejoresProductos, MenorProductos, ValoresCalculados, VentasMensuales } from './dashboard.interface';


@Injectable({
  providedIn: 'root'
})

export class DashBoardService {
    constructor(private http: HttpClient) {}

    apiData = 'https://localhost:4034/api/';

    getValoresCalculados(): Observable<ValoresCalculados> {
        return this.http.get<ValoresCalculados[]>(this.apiData + 'Estadisticas/ValoresCalculados').pipe(
          map((valoresCalculadosArray: ValoresCalculados[]) => {
            // Supongamos que solo deseas el primer objeto del array
            return valoresCalculadosArray[0];
          })
        );
      }

    getBestClients(): Observable<MejoresClientes[]> {
        return this.http.get<MejoresClientes[]>(this.apiData+'Estadisticas/MejoresClientes');
    }

    getVentasMensuales(): Observable<VentasMensuales[]> {
        return this.http.get<VentasMensuales[]>(this.apiData+'Estadisticas/VentasMensuales');
    }

    getMejoresProductos(): Observable<MejoresProductos[]> {
        return this.http.get<MejoresProductos[]>(this.apiData+'Estadisticas/MejoresProductos');
    }

    getPeoresProductos(): Observable<MenorProductos[]> {
        return this.http.get<MenorProductos[]>(this.apiData+'Estadisticas/PeoresProductos');
    }

    getInventarioProductos(): Observable<InventarioProductos[]> {
        return this.http.get<InventarioProductos[]>(this.apiData+'Inventario/Productos');
    }

    getInventarioInsumos(): Observable<InventarioInsumos[]> {
        return this.http.get<InventarioInsumos[]>(this.apiData+'Inventario/Insumos');
    }
} 