import { Component, OnInit } from '@angular/core';
import { InsumoService } from './insumo.service';
import { Insumo } from './insumo';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.component.html',
  styleUrls: ['./insumos.component.css']
})
export class InsumosComponent implements OnInit {
  insumos: Insumo[] = [];
  dtOptions = {};
  // Variables para el formulario de inserción
  nuevoInsumo: Insumo = {
    nombreInsumo: '',
    idProveedor: 0,
    unidad: '',
    precio: 0,
    observaciones: '',
    cantidadAceptable: 0,
    estatus: '1',
    idInsumo: 0,
    idInventario: 0
  };

  constructor(private insumoService: InsumoService) { }

  ngOnInit(): void {
    // Inicializa DataTables en el elemento HTML de la tabla
    this.dtOptions = {
      pagingType: 'full_numbers',
      // Idioma en español
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
      },
      dom: 'Blfrtip',
      buttons: [
        {
          extend: 'copy',
          text: '<i class="fa-solid fa-copy"></i> ',
          titleAttr: 'Copiar contenido',
          className: 'btn btn-secondary'
        },
        {
          extend: 'excelHtml5',
          text: '<i class="fas fa-file-excel"></i> ',
          titleAttr: 'Exportar a Excel',
          className: 'btn btn-success'
        },
        {
          extend: 'pdfHtml5',
          text: '<i class="fas fa-file-pdf"></i> ',
          titleAttr: 'Exportar a PDF',
          className: 'btn btn-danger'
        },
        {
          extend: 'print',
          text: '<i class="fa fa-print"></i> ',
          titleAttr: 'Imprimir',
          className: 'btn btn-danger'
        },
      ],
      // Uso de botones   
      responsive: true,
    };
    // Cargar todos los insumos al iniciar el componente
    this.getAllInsumos();
  }

  // Obtener todos los insumos activos
  getAllInsumos(): void {
    this.insumoService.getAllInsumos().subscribe(
      (data) => {
        this.insumos = data.filter((insumo) => insumo.estatus === "1");
        //console.log(this.insumos);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Insertar un nuevo insumo
  

  // Eliminar el insumo seleccionado
  deleteInsumo(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.insumoService.deleteInsumo(id).subscribe(
          () => {
            this.insumos = this.insumos.filter(insumo => insumo.idInsumo !== id);
            Swal.fire('¡Eliminado!', 'El insumo ha sido eliminado.', 'success');
          },
          (error) => {
            console.error(error);
            Swal.fire('¡Error!', 'El insumo aún se encuentra activo en un producto.', 'error');
          }
        );
      }
    });
  }
}
