import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  dtOptions = {};
  ngOnInit(): void {
    // Inicializa DataTables en el elemento HTML de la tabla
    this.dtOptions = {
      pagingType: 'full_numbers',
      // Idioma en español
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json',
      },
      dom: 'Blfrtip',
      buttons: [
        {
          extend: 'copy',
          text: '<i class="fa-solid fa-copy"></i> ',
          titleAttr: 'Copiar contenido',
          className: 'btn btn-secondary',
        },
        {
          extend: 'excelHtml5',
          text: '<i class="fas fa-file-excel"></i> ',
          titleAttr: 'Exportar a Excel',
          className: 'btn btn-success',
        },
        {
          extend: 'pdfHtml5',
          text: '<i class="fas fa-file-pdf"></i> ',
          titleAttr: 'Exportar a PDF',
          className: 'btn btn-danger',
        },
        {
          extend: 'print',
          text: '<i class="fa fa-print"></i> ',
          titleAttr: 'Imprimir',
          className: 'btn btn-danger',
        },
      ],
      // Uso de botones
      responsive: true,
    };


  }
  cargarFotografia(): void {
    const inputFile = document.getElementById('inputFileFoto') as HTMLInputElement;
    if (inputFile.files && inputFile.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fotoB64 = e.target?.result as string;

        // Creamos un objeto Image para cargar la imagen y asegurarnos de que esté completamente cargada
        const img = new Image();
        img.onload = () => {
          const fotoPortada = document.getElementById('fotoPortada') as HTMLImageElement;
          const codigoImagen = document.getElementById('codigoImagen') as HTMLInputElement;

          if (fotoPortada) {
            fotoPortada.src = fotoB64;
          }
          if (codigoImagen) {
            codigoImagen.value = fotoB64;
          }
        };
        img.src = fotoB64;
      };

      reader.readAsDataURL(inputFile.files[0]);
    }
  }

  limpiarCampos(): void {
  // Limpiar los campos de texto
  $('input[type="text"], input[type="number"], textarea').val('');

  // Limpiar el atributo src de la imagen
  $('#fotoPortada').attr('src', '');
  }

}
