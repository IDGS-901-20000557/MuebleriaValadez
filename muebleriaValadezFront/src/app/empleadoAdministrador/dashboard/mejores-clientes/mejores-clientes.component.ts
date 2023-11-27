import { Component } from '@angular/core';
import { DashBoardService } from '../dashboard.service';
import { MejoresClientes } from '../dashboard.interface';

@Component({
  selector: 'app-mejores-clientes',
  templateUrl: './mejores-clientes.component.html',
  styleUrls: ['./mejores-clientes.component.css']
})
export class MejoresClientesComponent {

  constructor(private dashboardService: DashBoardService) {}
  data: any[] = [];
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  ngOnInit() {
    this.dashboardService.getBestClients().subscribe(
      (bestClients: MejoresClientes[]) => {
        this.data = bestClients.map((inventoryProduct) => ({
          name: inventoryProduct.fullName,
          value: inventoryProduct.total
        }));
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
