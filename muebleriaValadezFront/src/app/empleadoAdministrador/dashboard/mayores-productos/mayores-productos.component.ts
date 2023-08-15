import { Component } from '@angular/core';
import { DashBoardService } from '../dashboard.service';
import { MejoresProductos } from '../dashboard.interface';

@Component({
  selector: 'app-mayores-productos',
  templateUrl: './mayores-productos.component.html',
  styleUrls: ['./mayores-productos.component.css']
})
export class MayoresProductosComponent {
  constructor(private dashboardService: DashBoardService) {}
  data: any[] = [];
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Mejores Productos';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Total vendido ($)';

  ngOnInit() {
    this.dashboardService.getMejoresProductos().subscribe(
      (bestProducts: MejoresProductos[]) => {
        this.data = bestProducts.map((bestProducts) => ({
          name: bestProducts.nombre,
          value: bestProducts.total_obtenido
        }));
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
