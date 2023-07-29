import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent  implements OnInit {
  // @ViewChild('dataTable') table!: ElementRef;
  dtOptions: DataTables.Settings={};
  dtTrigger:Subject<any>=new Subject<any>();
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      searching:true,
    //  paging:false
    lengthChange:false,
    language:{
      searchPlaceholder:'Text Customer'
    }
  };

  }
  // ngAfterViewInit(): void {
  //   // Inicializa DataTables en el elemento HTML de la tabla
  //   $(this.table.nativeElement).DataTable();
  // }


}
