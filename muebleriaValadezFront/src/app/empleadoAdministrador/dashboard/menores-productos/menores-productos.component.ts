import { Component } from '@angular/core';
import { MenorProductos } from '../dashboard.interface';
import { DashBoardService } from '../dashboard.service';

@Component({
  selector: 'app-menores-productos',
  templateUrl: './menores-productos.component.html',
  styleUrls: ['./menores-productos.component.css']
})
export class MenoresProductosComponent {
  constructor(private dashboardService: DashBoardService) {}
  data: any[] = [];
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Menores Productos';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Total vendido ($)';

  ngOnInit() {
    this.dashboardService.getPeoresProductos().subscribe(
      (lowProducts: MenorProductos[]) => {
        this.data = lowProducts.map((lowProducts) => ({
          name: lowProducts.nombre,
          value: lowProducts.total_obtenido
        }));
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
