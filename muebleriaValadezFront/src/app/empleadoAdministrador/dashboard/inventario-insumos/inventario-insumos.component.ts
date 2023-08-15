import { Component } from '@angular/core';
import { DashBoardService } from '../dashboard.service';
import { InventarioInsumos } from '../dashboard.interface';

@Component({
  selector: 'app-inventario-insumos',
  templateUrl: './inventario-insumos.component.html',
  styleUrls: ['./inventario-insumos.component.css']
})
export class InventarioInsumosComponent {
  constructor(private dashboardService: DashBoardService) {}

  view: [number, number] = [700, 500];
  data2: any[] = []; // Utiliza un array para almacenar los datos

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Insumos';
  showYAxisLabel = true;
  yAxisLabel = 'Cantidad Disponible';

  colorScheme = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] };

  ngOnInit() {
    this.dashboardService.getInventarioInsumos().subscribe(
      (inventoryInsumos: InventarioInsumos[]) => {
        this.data2 = inventoryInsumos.map((inventoryProduct) => ({
          name: inventoryProduct.nameIngredient,
          value: inventoryProduct.quantityAvailable,
        }));
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
