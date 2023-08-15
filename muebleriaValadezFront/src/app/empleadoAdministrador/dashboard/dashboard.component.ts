import { Component } from '@angular/core';
import { DashBoardService } from './dashboard.service';
import { Observable } from 'rxjs';
import { InventarioProductos, ValoresCalculados } from './dashboard.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private dashboardService: DashBoardService) {
    this.dashboardService.getValoresCalculados().subscribe(
      (data: ValoresCalculados) => this.datos = data
    );
  }

  datos!:ValoresCalculados ;

  ngOnInit(): void {
    
  }

}
