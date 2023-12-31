import { Component } from '@angular/core';
import { LoadingService } from './loading.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'muebleriaValadezFront';
  constructor(private loadingService: LoadingService) {}
  isLoading() {
    return this.loadingService.isLoading;
  }

}
