import { Component } from '@angular/core';
import { InventarioProductos } from '../dashboard.interface';
import { DashBoardService } from '../dashboard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventario-productos',
  templateUrl: './inventario-productos.component.html',
  styleUrls: ['./inventario-productos.component.css']
})
export class InventarioProductosComponent {
  constructor(private dashboardService: DashBoardService) {}

  view: [number, number] = [700, 500];
  data2: any[] = []; // Utiliza un array para almacenar los datos

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Productos';
  showYAxisLabel = true;
  yAxisLabel = 'Cantidad Disponible';

  colorScheme = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] };

  ngOnInit() {
    this.dashboardService.getInventarioProductos().subscribe(
      (inventoryProducts: InventarioProductos[]) => {
        this.data2 = inventoryProducts.map((inventoryProduct) => ({
          name: inventoryProduct.nameProduct,
          value: inventoryProduct.quantityAvailable,
        }));
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
