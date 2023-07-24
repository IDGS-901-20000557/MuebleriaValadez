import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent  {
  @ViewChild('dataTable') table!: ElementRef;

  ngAfterViewInit(): void {
    // Inicializa DataTables en el elemento HTML de la tabla
    $(this.table.nativeElement).DataTable();
  }


}
