import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Repartir } from './repartir';
import { RepartirDetalle } from './repartirDetalle';
import { ProductoRepartir } from './ProductoRepartir';
import { LoadingService } from 'src/app/loading.service';
import { RepartirService } from './repartir.service';

@Component({
  selector: 'app-repartir',
  templateUrl: './repartir.component.html',
  styleUrls: ['./repartir.component.css'],
})
export class RepartirComponent {
  repartirForm!: FormGroup;
  Repartires: Repartir[] = [];
  Productos: ProductoRepartir[] = [];
  RepartirDetalle!: RepartirDetalle;
  dtOptions = {};
  repartirCargados = false;
  verProducto = false;

  constructor(
    private repartirServicio: RepartirService,
    private fb: FormBuilder,
    private loadingService: LoadingService
  ) {}
  ngOnInit(): void {
    this.repartirForm = this.fb.group({});
    // Inicializa DataTables en el elemento HTML de la tabla
    this.repartirForm.addControl('idRepartir', this.fb.control('', []));
    this.repartirForm.addControl(
      'codigo',
      this.fb.control('', this.fb.control('', []))
    );
    this.repartirForm.addControl(
      'nombreCliente',
      this.fb.control('', this.fb.control('', []))
    );
    this.repartirForm.addControl(
      'codigoImagen',
      this.fb.control('', this.fb.control('', []))
    );
    this.repartirForm.addControl(
      'fechaPedido',
      this.fb.control('', this.fb.control('', []))
    );
    this.repartirForm.addControl(
      'domicilio',
      this.fb.control('', this.fb.control('', []))
    );
    this.repartirForm.addControl('total', this.fb.control('', []));

    this.getAllRepartir();
  }

  getAllRepartir(): void {
    this.repartirServicio.getAllRepartir().subscribe(
      (data) => {
        this.Repartires = data;
        this.inicializarDataTables();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de consultar los productos a repartir!',
          text: 'Cominiquese con soporte.',
        });
        console.error(error);
      }
    );
  }

  entregarProducto() {
    const idRepartir = document.getElementById(
      'idRepartir'
    ) as HTMLInputElement;
    const idUser = Number(sessionStorage.getItem('idUsuario'));
    const idEmpleado = Number(sessionStorage.getItem('idEmpleado'));
    this.loadingService.show();
    this.repartirServicio
      .entregarRepartir(Number(idRepartir.value), idEmpleado, idUser)
      .then((response: any) => {
        Swal.fire('Entregado!', 'El pedido ha sido entregado.', 'success');
        this.getAllRepartir();
        this.limpiarCampos();
      })
      .catch((error: any) => {
        Swal.fire('¡Error!', 'Hubo un error al entregar el pedido.', 'error');
        console.error(error);
      })
      .finally(() => {
        this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
      });
  }
  verPedido(repartir: Repartir): void {
    const idRepartir = repartir.idPedido;
    this.loadingService.show();

    this.repartirServicio.getDetalleRepartir(Number(idRepartir)).subscribe(
      (detalleRepartir: RepartirDetalle) => {
        this.verProducto = true;
        const idRepartir = document.getElementById(
          'idRepartir'
        ) as HTMLInputElement;
        idRepartir.value = (repartir.idPedido ?? 0).toString();

        const codigo = document.getElementById('codigo') as HTMLInputElement;
        codigo.value = (detalleRepartir.codigo ?? 0).toString();

        const nombreCliente = document.getElementById(
          'nombreCliente'
        ) as HTMLInputElement;
        nombreCliente.value = (detalleRepartir.nombreCliente ?? 0).toString();

        const fechaPedido = document.getElementById(
          'fechaPedido'
        ) as HTMLInputElement;
        if (detalleRepartir.fechaPedido !== undefined) {
          const fechaDividida = detalleRepartir.fechaPedido
            .toString()
            .split('T');
          fechaPedido.value = (fechaDividida[0] ?? 0).toString();
        }

        const domicilio = document.getElementById(
          'domicilio'
        ) as HTMLInputElement;
        domicilio.value = (detalleRepartir.domicilio ?? 0).toString();

        const total = document.getElementById('total') as HTMLInputElement;
        total.value = (detalleRepartir.total ?? 0).toString();
        if (detalleRepartir.productoRepartir) {
          this.Productos = detalleRepartir.productoRepartir;
        } else {
          this.Productos = [];
        }

        this.loadingService.hide();
      },
      (error) => {
        console.error(error);
        Swal.fire(
          '¡Error!',
          'Hubo un problema al consultar el detalle del pedido.',
          'error'
        );
        this.loadingService.hide();
      }
    );
  }

  inicializarDataTables(): void {
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
    this.repartirCargados = true;
  }

  limpiarCampos(): void {
    this.verProducto = false;
    this.Productos = [];
    const idRepartir = document.getElementById(
      'idRepartir'
    ) as HTMLInputElement;
    idRepartir.value = '';

    const codigo = document.getElementById('codigo') as HTMLInputElement;
    codigo.value = '';

    const nombreCliente = document.getElementById(
      'nombreCliente'
    ) as HTMLInputElement;
    nombreCliente.value = '';

    const fechaPedido = document.getElementById(
      'fechaPedido'
    ) as HTMLInputElement;

    fechaPedido.value = '';

    const domicilio = document.getElementById('domicilio') as HTMLInputElement;
    domicilio.value = '';

    const total = document.getElementById('total') as HTMLInputElement;
    total.value = '';
  }
}
