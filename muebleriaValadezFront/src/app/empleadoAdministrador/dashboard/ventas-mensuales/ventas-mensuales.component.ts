import { Component } from '@angular/core';
import { DashBoardService } from '../dashboard.service';
import { VentasMensuales } from '../dashboard.interface';

@Component({
  selector: 'app-ventas-mensuales',
  templateUrl: './ventas-mensuales.component.html',
  styleUrls: ['./ventas-mensuales.component.css']
})
export class VentasMensualesComponent {
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
    this.dashboardService.getVentasMensuales().subscribe(
      (salesMonthly: VentasMensuales[]) => {
        this.data = salesMonthly.map((salesMonthly) => ({
          name: salesMonthly.month,
          value: salesMonthly.total_vendido
        }));
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
