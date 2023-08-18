import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { LoadingService } from 'src/app/loading.service';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductosService } from '../productos/productos.service';
import { Insumo } from './insumo';
import { Producto } from './producto';
import { InventariosService } from './inventarios.service';
import { Lote } from './lote';
import jsPDF from 'jspdf';
import { Inventario } from './inventario';

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css'],
})
export class InventariosComponent implements OnInit {
  LoteForm!: FormGroup;
  LotesCargados = false;
  esProductoSeleccionado: boolean = true;
  pendiente: boolean = false;
  InsumoForm!: FormGroup;
  ProductoForm!: FormGroup;
  insumos: Insumo[] = [];
  productos: Producto[] = [];
  tablaInsumos: Insumo[] = [];
  tablaProductos: Producto[] = [];
  dtOptions = {};
  insumo!: Insumo;
  producto!: Producto;
  lote!: Lote;
  lotePendiente!: Lote;
  lotes!: Lote[];
  inventario!: Inventario[];

  constructor(
    private inventarioService: InventariosService,
    private fb: FormBuilder,
    private loadingService: LoadingService
  ) {}

  validateCantidad(control: any) {
    const cantidadValue = control.value;

    if (cantidadValue <= 0) {
      return { cantidadInvalida: true };
    }

    return null; // La validación pasó correctamente
  }

  ngOnInit(): void {
    this.LoteForm = this.fb.group({});
    this.InsumoForm = this.fb.group({});
    this.ProductoForm = this.fb.group({});

    this.LoteForm.addControl('idLote', this.fb.control('', []));
    this.LoteForm.addControl(
      'noLote',
      this.fb.control('', [Validators.required, this.validateCantidad])
    );
    this.LoteForm.addControl(
      'costo',
      this.fb.control('', [Validators.required, this.validateCantidad])
    );
    this.LoteForm.addControl(
      'txtObservaciones',
      this.fb.control('', [Validators.required])
    );

    this.InsumoForm.addControl(
      'insumo',
      this.fb.control('', [Validators.required])
    );
    this.InsumoForm.addControl(
      'cantidad',
      this.fb.control('', [Validators.required, this.validateCantidad])
    );

    this.ProductoForm.addControl(
      'producto',
      this.fb.control('', [Validators.required])
    );
    this.ProductoForm.addControl(
      'cantidad',
      this.fb.control('', [Validators.required, this.validateCantidad])
    );
    this.getAllInsumos();
    this.getAllProductos();
    this.getAllLote();
  }
  getAllLote(): void {
    this.inventarioService.getAllLotes().subscribe(
      (data) => {
        this.lotes = data;
        this.getAllInventario();

      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de consultar Lotes!',
          text: 'Cominiquese con soporte.',
        });
        console.error(error);
      }
    );
  }

  getAllInventario(): void {
    this.inventarioService.getAllInventario().subscribe(
      (data) => {
        this.inventario = data.sort();
        this.inicializarDataTables();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de consultar inventario!',
          text: 'Cominiquese con soporte.',
        });
        console.error(error);
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
      lengthMenu: [5, 10, 15, 20],
    pageLength: 10,
    };
    this.LotesCargados = true;
  }

  getAllProductos(): void {
    this.inventarioService.getAllProductos().subscribe(
      (data) => {
        this.productos = data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de consultar productos!',
          text: 'Cominiquese con soporte.',
        });
        console.error(error);
      }
    );
  }

  eliminarInsumo(): void {
    if (this.tablaInsumos.length > 0) {
      let precioVentaActual = parseFloat(this.LoteForm.get('costo')?.value);
      if (isNaN(precioVentaActual)) {
        precioVentaActual = 0;
      }

      const lastInsumo = this.tablaInsumos[this.tablaInsumos.length - 1];

      if (
        lastInsumo &&
        'cantidadInsumo' in lastInsumo &&
        'precio' in lastInsumo
      ) {
        const cantidadInsumo = Number(lastInsumo.cantidadInsumo);
        const precio = Number(lastInsumo.precio);

        if (!isNaN(cantidadInsumo) && !isNaN(precio)) {
          const nuevoPrecioVenta = precioVentaActual - cantidadInsumo * precio;
          this.LoteForm.get('costo')?.setValue(nuevoPrecioVenta.toFixed(2));
        }
      }

      this.tablaInsumos.pop();
    }
  }

  agregarInsumo(): void {
    if (this.InsumoForm.valid) {
      const insumo = this.InsumoForm.get('insumo')?.value;
      const cantidad = parseFloat(this.InsumoForm.get('cantidad')?.value);
      const parts = insumo.split('¬');
      const precio = parseFloat(parts[0]);
      const unidad = parts[1];
      const nombre = parts[2];
      const idInsumo = parseInt(parts[3]);
      this.tablaInsumos.push({
        idInsumo: idInsumo,
        nombreInsumo: nombre,
        unidad: unidad,
        precio: precio,
        cantidadInsumo: cantidad,
      });
      let precioVentaActual = parseFloat(this.LoteForm.get('costo')?.value);
      if (isNaN(precioVentaActual)) {
        precioVentaActual = 0;
      }
      const nuevoPrecioVenta = precioVentaActual + cantidad * precio;
      this.LoteForm.get('costo')?.setValue(nuevoPrecioVenta.toFixed(2));
    }
  }

  printLote(lote: Lote) {
    let pdf = new jsPDF();
    this.loadingService.show();
    const idLote = Number(lote.idLote) || 0;
    this.inventarioService.getLote(idLote).subscribe(
      (lotePrincipal: Lote) => {
        let insumosTable = `
          <table style="width: 100%;">
            <tr>
              <th style="text-align: center; font-size: 3px; ">Nombre</th>
              <th style="text-align: center; font-size: 3px; ">Cantidad</th>
              <th style="text-align: center; font-size: 3px;">Precio</th>
              <th style="text-align: center; font-size: 3px; ">Total</th>
            </tr>`;
        console.log()

        if (lotePrincipal.insumosLote) {
          if(lotePrincipal.insumosLote?.length>0){


          console.log(lotePrincipal.insumosLote);
          for (const insumo of lotePrincipal.insumosLote) {
            let costoTotal = 0;
            costoTotal =
              insumo.precio && insumo.cantidadInsumo
                ? insumo.precio * insumo.cantidadInsumo
                : 0;

            insumosTable += `
              <tr>
                <td style="font-size: 3px; text-align: center; ">${insumo.nombreInsumo}</td>
                <td style="text-align: center; font-size: 3px;">${
                  insumo.cantidadInsumo
                }</td>
                <td style="text-align: center; font-size: 3px;">$${
                  insumo.precio
                }</td>
                <td style="text-align: center; font-size: 3px;">$${costoTotal.toFixed(
                  2
                )}</td>
              </tr>`;
          }
        }else if (lotePrincipal.productosLote) {
          if(lotePrincipal.productosLote.length>0){


          for (const producto of lotePrincipal.productosLote) {
            let costoTotal = 0;
            costoTotal =
            producto.costoProduccion && producto.cantidadProducto
                ? producto.costoProduccion * producto.cantidadProducto
                : 0;

            insumosTable += `
              <tr>
                <td style="font-size: 3px; text-align: center; ">${producto.nombreProducto}</td>
                <td style="text-align: center; font-size: 3px;">${
                  producto.cantidadProducto
                }</td>
                <td style="text-align: center; font-size: 3px;">$${
                  producto.costoProduccion
                }</td>
                <td style="text-align: center; font-size: 3px;">$${costoTotal.toFixed(
                  2
                )}</td>
              </tr>`;
          }
        }
        } else {
          insumosTable += `
            <tr>
              <td colspan="4" style="text-align: center; font-size: 3px;">No hay insumos/productos en este lote.</td>
            </tr>`;
        }
        }

        insumosTable += `</table>`;

        pdf.html(
          `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <!-- ... (head content) ... -->
          </head>
          <body>
            <div class="ticket" style="width: 100px; margin: 10px 0 0 55px; border: 2px solid #333; border-radius: 10px; padding: 10px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); background-color: #fff;">
              <div class="header" style="text-align: center; margin-bottom: 5px;">
                <div class="title" style="font-size: 8px; font-weight: bold;">Ticket de Compra Lote</div>
                <div style="font-size: 6px;">#${lotePrincipal.noLote}</div>
              </div>
              <div class="details" >
                ${insumosTable}
              </div>
              <div  style="margin-top: 2px; text-align: right; font-weight: bold; font-size: 6px;">Total: $${lotePrincipal.costo}</div>
              <div  style="margin-top: 2px;  font-size: 3px;">${lotePrincipal.observaciones}</div>
            </div>
          </body>
          </html>`,
          {
            callback: (pdf) => {
              pdf.save('ticketLote.pdf');
            },
          }
        );
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de consultar el lote!',
          text: 'Comuníquese con soporte.',
        });
      },
      () => {
        this.loadingService.hide();
      }
    );
  }

  entregarLoteInsumo() {
    const idUser = Number(sessionStorage.getItem('idUsuario'));
    this.lotePendiente.idUsuario = idUser;
    this.loadingService.show(); // Ocultar el loader, tanto si hay éxito como error
    console.log(this.lotePendiente);
    if (this.lotePendiente && this.lotePendiente.insumosLote && this.lotePendiente.insumosLote.length > 0) {
      this.inventarioService
      .entregarLoteInsumo(this.lotePendiente)
      .then((response: any) => {
        this.printLote(this.lotePendiente);
        this.limpiarCampos();
        this.getAllLote();
        Swal.fire({
          icon: 'success',
          title: '¡Lote entregado!',
          text: 'Revise la tabla de la derecha, ahi lo encontrara.',
        });
      })
      .catch((error: any) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de entregar lote!',
          text: 'Cominiquese con soporte.',
        });
        console.error(error);
      })
      .finally(() => {
        this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
      });
    }else if(this.lotePendiente && this.lotePendiente.productosLote && this.lotePendiente.productosLote.length > 0){
      this.inventarioService
      .entregarLoteProducto(this.lotePendiente)
      .then((response: any) => {

        if (response.startsWith("FALTA")) {
          const insumoNombre = response.split(": ")[1];
          Swal.fire({
              icon: 'info',
              title: 'Falta Insumo',
              text: `Falta inventario del insumo: ${insumoNombre}`,
          });
      }else{
         this.printLote(this.lotePendiente);
        this.limpiarCampos();
        this.getAllLote();
        Swal.fire({
          icon: 'success',
          title: '¡Lote entregado!',
          text: 'Revise la tabla de la derecha, ahi lo encontrara.',
        });
       }
      })
      .catch((error: any) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de entregar lote!',
          text: 'Cominiquese con soporte.',
        });
        console.error(error);
      })
      .finally(() => {
        this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
      });
    }

  }

  editarLote(lote: Lote): void {
    this.tablaInsumos = [];
    this.tablaProductos = [];
    this.loadingService.show();
    const idLote = Number(lote.idLote) || 0;
    this.inventarioService.getLote(idLote).subscribe(
      (lote: Lote) => {
        this.lotePendiente = lote;
        this.LoteForm.patchValue({
          idLote: lote.idLote,
          noLote: lote.noLote,
          costo: lote.costo,
          txtObservaciones: lote.observaciones,
        });
        const checkProductoRadio = document.getElementById(
          'checkProducto'
        ) as HTMLInputElement;
        const checkInsumoRadio = document.getElementById(
          'checkInsumo'
        ) as HTMLInputElement;
        const noLote = document.getElementById('noLote') as HTMLInputElement;
        noLote.disabled = true;

        if (checkProductoRadio && checkInsumoRadio) {
          checkProductoRadio.disabled = true;
          checkInsumoRadio.disabled = true;

          if (lote.insumosLote) {
            this.tablaInsumos = lote.insumosLote;
            checkInsumoRadio.checked = true;
            this.esProductoSeleccionado = false;
          } else {
            this.tablaInsumos = [];
          }

          if (lote.productosLote) {
            if (lote.productosLote?.length > 0) {
              this.tablaProductos = lote.productosLote;
              checkProductoRadio.checked = true;
              this.esProductoSeleccionado = true;
            }
          } else {
            this.tablaProductos = [];
          }
          this.pendiente = true;
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de consultar el lote!',
          text: 'Comuníquese con soporte.',
        });
      },
      () => {
        this.loadingService.hide();
      }
    );
  }

  eliminarLote(lote: Lote): void {
    const idUser = Number(sessionStorage.getItem('idUsuario'));

    const idLote = Number(lote.idLote) || 0;
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.inventarioService.deleteLote(idLote, idUser).subscribe(
          () => {
            this.loadingService.hide();
            Swal.fire('¡Eliminado!', 'El lote ha sido eliminado.', 'success');
            this.getAllLote();
            this.limpiarCampos();
          },
          (error) => {
            console.error(error);
            Swal.fire('¡Error!', 'Hubo un error al eliminar el lote.', 'error');
            this.loadingService.hide();
          }
        );
      }
    });
  }

  agregarProducto(): void {
    if (this.ProductoForm.valid) {
      const producto = this.ProductoForm.get('producto')?.value;
      const cantidad = parseFloat(this.ProductoForm.get('cantidad')?.value);
      const parts = producto.split('¬');
      const precio = parseFloat(parts[0]);
      const nombre = parts[1];
      const idProducto = parseInt(parts[2]);
      this.tablaProductos.push({
        idProducto: idProducto,
        nombreProducto: nombre,
        costoProduccion: precio,
        cantidadProducto: cantidad,
      });
      let precioVentaActual = parseFloat(this.LoteForm.get('costo')?.value);
      if (isNaN(precioVentaActual)) {
        precioVentaActual = 0;
      }
      const nuevoPrecioVenta = precioVentaActual + cantidad * precio;
      this.LoteForm.get('costo')?.setValue(nuevoPrecioVenta.toFixed(2));
    }
  }

  eliminarProducto(): void {
    if (this.tablaProductos.length > 0) {
      let precioVentaActual = parseFloat(this.LoteForm.get('costo')?.value);
      if (isNaN(precioVentaActual)) {
        precioVentaActual = 0;
      }

      const lastProducto = this.tablaProductos[this.tablaProductos.length - 1];

      if (
        lastProducto &&
        'cantidadProducto' in lastProducto &&
        'costoProduccion' in lastProducto
      ) {
        const cantidadProducto = Number(lastProducto.cantidadProducto);
        const precio = Number(lastProducto.costoProduccion);

        if (!isNaN(cantidadProducto) && !isNaN(precio)) {
          const nuevoPrecioVenta =
            precioVentaActual - cantidadProducto * precio;
          this.LoteForm.get('costo')?.setValue(nuevoPrecioVenta.toFixed(2));
        }
      }

      this.tablaProductos.pop();
    }
  }

  getAllInsumos(): void {
    this.inventarioService.getAllInsumos().subscribe(
      (data) => {
        this.insumos = data.filter((insumo) => insumo.estatus === '1');
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de consultar insumos!',
          text: 'Cominiquese con soporte.',
        });
      }
    );
  }

  limpiarCampos(): void {
    // Limpiar los campos de texto
    $(
      'input[type="text"], input[type="number"], input[type="hidden"], textarea'
    ).val('');
    this.tablaInsumos = [];
    this.tablaProductos = [];

    const checkProductoRadio = document.getElementById(
      'checkProducto'
    ) as HTMLInputElement;
    const checkInsumoRadio = document.getElementById(
      'checkInsumo'
    ) as HTMLInputElement;
    if (checkProductoRadio && checkInsumoRadio) {
      checkProductoRadio.disabled = false;
      checkInsumoRadio.disabled = false;
    }
    this.pendiente = false;
    const noLote = document.getElementById('noLote') as HTMLInputElement;
    noLote.disabled = false;

    // Limpiar el atributo src de la imagen
    this.LoteForm.reset();
  }

  agregarLote(): void {
    if (this.LoteForm.valid) {
      this.loadingService.show();
      //añadimos plote
      this.lote = {};
      // Utilizando una condicional ternaria para asignar el valor 0 si está vacío
      const idLoteValue = this.LoteForm.get('idLote')?.value;
      this.lote.idLote = idLoteValue ? parseInt(idLoteValue, 10) : 0;
      this.lote.noLote = parseFloat(this.LoteForm.get('noLote')?.value);
      this.lote.observaciones = this.LoteForm.get('txtObservaciones')?.value;
      this.lote.costo = parseFloat(this.LoteForm.get('costo')?.value);

      //Añadimos el id Usuario
      const idUsuarioString = sessionStorage.getItem('idUsuario');
      if (idUsuarioString !== null) {
        this.lote.idUsuario = parseInt(idUsuarioString, 10);
      }

      //Añadimos el id Usuario
      const idSucursalString = sessionStorage.getItem('idDireccionSucursal');
      if (idSucursalString !== null) {
        this.lote.idSucursal = parseInt(idSucursalString, 10);
      }

      const checkProductoRadio = document.getElementById(
        'checkProducto'
      ) as HTMLInputElement;
      const checkInsumoRadio = document.getElementById(
        'checkInsumo'
      ) as HTMLInputElement;
      if (checkInsumoRadio.checked) {
        if (this.tablaInsumos.length > 0) {
          //añadimos los insumos
          for (const insumo of this.tablaInsumos) {
            if (!this.lote.insumosLote) {
              this.lote.insumosLote = [insumo];
            } else {
              this.lote.insumosLote.push(insumo);
            }
          }
          if (idLoteValue === null || idLoteValue === '') {
            //Insertar Lote insumo
            this.inventarioService
              .insertLoteInsumo(this.lote)
              .then((response: any) => {
                this.limpiarCampos();
                this.getAllLote();
                Swal.fire({
                  icon: 'success',
                  title: '¡Lote creado!',
                  text: 'Revise la tabla de la derecha, ahi lo encontrara.',
                });
              })
              .catch((error: any) => {
                Swal.fire({
                  icon: 'error',
                  title: '¡Error a la hora de crear lote!',
                  text: 'Cominiquese con soporte.',
                });
                console.error(error);
              })
              .finally(() => {
                this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
              });
          } else {
            //Modificar lote
            this.inventarioService
              .updateLoteInsumo(this.lote)
              .then((response: any) => {
                this.limpiarCampos();
                this.getAllLote();
                Swal.fire({
                  icon: 'success',
                  title: '¡Lote modificado!',
                  text: 'Revise la tabla de la derecha, ahi lo encontrara.',
                });
              })
              .catch((error: any) => {
                Swal.fire({
                  icon: 'error',
                  title: '¡Error a la hora de modificar lote!',
                  text: 'Cominiquese con soporte.',
                });
                console.error(error);
              })
              .finally(() => {
                this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
              });
          }
        } else {
          Swal.fire({
            icon: 'info',
            title: '¡Debe haber al menos un insumo!',
            text: 'Agregue insumos en el boton de insumos.',
          });
        }
      } else if (checkProductoRadio.checked) {
        if (this.tablaProductos.length > 0) {
          //añadimos los insumos
          for (const producto of this.tablaProductos) {
            if (!this.lote.productosLote) {
              this.lote.productosLote = [producto];
            } else {
              this.lote.productosLote.push(producto);
            }
          }

          if (idLoteValue === null || idLoteValue === '') {
            //Insertar Lote productos
            this.inventarioService
              .insertLoteProducto(this.lote)
              .then((response: any) => {
                this.limpiarCampos();
                this.getAllLote();
                Swal.fire({
                  icon: 'success',
                  title: '¡Lote creado!',
                  text: 'Revise la tabla de la derecha, ahi lo encontrara.',
                });
              })
              .catch((error: any) => {
                Swal.fire({
                  icon: 'error',
                  title: '¡Error a la hora de crear lote!',
                  text: 'Cominiquese con soporte.',
                });
                console.error(error);
              })
              .finally(() => {
                this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
              });
          } else {
            //Modificar lote productos
            this.inventarioService
              .updateLoteProducto(this.lote)
              .then((response: any) => {
                this.limpiarCampos();
                this.getAllLote();
                Swal.fire({
                  icon: 'success',
                  title: '¡Lote modificado!',
                  text: 'Revise la tabla de la derecha, ahi lo encontrara.',
                });
              })
              .catch((error: any) => {
                Swal.fire({
                  icon: 'error',
                  title: '¡Error a la hora de modificar lote!',
                  text: 'Cominiquese con soporte.',
                });
                console.error(error);
              })
              .finally(() => {
                this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
              });
          }
        } else {
          Swal.fire({
            icon: 'info',
            title: '¡Debe haber al menos un producto!',
            text: 'Agregue productos en el boton de productos.',
          });
        }
      }
    }
  }
}
