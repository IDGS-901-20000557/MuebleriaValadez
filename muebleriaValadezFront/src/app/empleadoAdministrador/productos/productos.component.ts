import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { LoadingService } from 'src/app/loading.service';
import { ProductosService } from './productos.service';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { Insumo } from './insumo';
import Swal from 'sweetalert2';
import { LibroReceta } from './libro-receta';
import { Producto } from './producto';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  insumos: Insumo[] = [];
  productos: Producto[] = [];
  insumo!: Insumo;
  tablaInsumos: Insumo[] = [];
  dtOptions = {};
  InsumoForm!: FormGroup;
  ProductoForm!: FormGroup;
  libroReceta!: LibroReceta;
  producto!: Producto;
  productosCargados = false;


  validateCantidad(control: any) {
    const cantidadValue = control.value;

    if (cantidadValue <= 0) {
      return { cantidadInvalida: true };
    }

    return null; // La validación pasó correctamente
  }

  ngOnInit(): void {
    this.InsumoForm = this.fb.group({});
    this.ProductoForm = this.fb.group({});
    // Inicializa DataTables en el elemento HTML de la tabla

    this.ProductoForm.addControl('idProducto', this.fb.control('', []));
    this.ProductoForm.addControl(
      'nombreProducto',
      this.fb.control('', [Validators.required])
    );
    this.ProductoForm.addControl(
      'txtDescripcion',
      this.fb.control('', [Validators.required])
    );
    this.ProductoForm.addControl(
      'codigoImagen',
      this.fb.control('', [Validators.required])
    );
    this.ProductoForm.addControl(
      'costoProduccion',
      this.fb.control('', [Validators.required, this.validateCantidad])
    );
    this.ProductoForm.addControl(
      'precioventa',
      this.fb.control('', [Validators.required, this.validateCantidad])
    );
    this.ProductoForm.addControl('observaciones', this.fb.control('', []));
    this.ProductoForm.addControl(
      'cantidadAceptable',
      this.fb.control('', [Validators.required, this.validateCantidad])
    );

    this.InsumoForm.addControl(
      'insumo',
      this.fb.control('', [Validators.required])
    );
    this.InsumoForm.addControl(
      'cantidad',
      this.fb.control('', [Validators.required, this.validateCantidad])
    );


    this.getAllInsumos();
    this.getAllProductos();
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
    this.productosCargados = true;
  }

  constructor(
    private productoService: ProductosService,
    private fb: FormBuilder,
    private loadingService: LoadingService
  ) {}

  eliminarProducto(producto: Producto): void {
    const idUser = Number(sessionStorage.getItem('idUsuario'));

    const idProducto = Number(producto.idProducto) || 0;
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.productoService.deleteLibroReceta(idProducto, idUser).subscribe(
          () => {
            this.loadingService.hide();
            Swal.fire('¡Eliminado!', 'El Producto ha sido eliminado.', 'success');
            this.getAllProductos();
          },
          (error) => {
            console.error(error);
            Swal.fire('¡Error!', 'Hubo un error al eliminar el producto.', 'error');
            this.loadingService.hide();
          }
        );
      }
    });

  }

  editarProducto(producto: Producto): void {
    this.tablaInsumos = [];
    this.loadingService.show();
    const idProducto = Number(producto.idProducto) || 0;
    this.productoService.getLibroReceta(idProducto).subscribe(
      (libroReceta: LibroReceta) => {
        this.ProductoForm.patchValue({
          idProducto: libroReceta.productoLibroRecetas?.idProducto,
          nombreProducto: libroReceta.productoLibroRecetas?.nombreProducto,
          txtDescripcion: libroReceta.productoLibroRecetas?.descripcion,
          codigoImagen: libroReceta.productoLibroRecetas?.foto,
          costoProduccion: libroReceta.productoLibroRecetas?.costoProduccion,
          precioventa: libroReceta.productoLibroRecetas?.precioVenta,
          observaciones: libroReceta.productoLibroRecetas?.observaciones,
          cantidadAceptable: libroReceta.productoLibroRecetas?.cantidadAceptable
        });
        if (libroReceta.insumosLibroRecetas) {
          this.tablaInsumos = libroReceta.insumosLibroRecetas;
        } else {
          this.tablaInsumos = [];
        }
        console.log(libroReceta.insumosLibroRecetas);
        console.log(this.tablaInsumos);

        // Establecer la imagen en el elemento <img>
        const fotoPortada = document.getElementById('fotoPortada') as HTMLImageElement;
        fotoPortada.src = libroReceta.productoLibroRecetas?.foto ?? 'SINURL';

        // Resto del código...
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de consultar el producto!',
          text: 'Comuníquese con soporte.',
        });
        console.error(error);
      },
      () => {
        this.loadingService.hide();
      }
    );
  }

  getAllInsumos(): void {
    this.productoService.getAllInsumos().subscribe(
      (data) => {
        this.insumos = data.filter((insumo) => insumo.estatus === '1');      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de consultar insumos!',
          text: 'Cominiquese con soporte.',
        });
        console.error(error);
      }
    );
  }



  getAllProductos(): void {
    this.productoService.getAllProductos().subscribe(
      (data) => {
        this.productos = data;
        this.inicializarDataTables();
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
      let precioVentaActual = parseFloat(
        this.ProductoForm.get('costoProduccion')?.value
      );
      if (isNaN(precioVentaActual)) {
        precioVentaActual = 0;
      }
      const nuevoPrecioVenta = precioVentaActual + cantidad * precio;
      this.ProductoForm.get('costoProduccion')?.setValue(
        nuevoPrecioVenta.toFixed(2)
      );
    }
  }

  agregarProducto(): void {
    if (this.ProductoForm.valid) {
      if (this.tablaInsumos.length > 0) {
        this.loadingService.show();
        //añadimos producto
        this.producto = {};
        this.libroReceta = {};
        // Utilizando una condicional ternaria para asignar el valor 0 si está vacío
        const idProductoValue = this.ProductoForm.get('idProducto')?.value;
        this.producto.idProducto = idProductoValue ? parseInt(idProductoValue, 10) : 0;
        this.producto.nombreProducto =this.ProductoForm.get('nombreProducto')?.value;
        this.producto.descripcion =this.ProductoForm.get('txtDescripcion')?.value;
        this.producto.foto = this.ProductoForm.get('codigoImagen')?.value;
        this.producto.costoProduccion = parseFloat(this.ProductoForm.get('costoProduccion')?.value);
        this.producto.precioVenta = this.ProductoForm.get('precioventa')?.value;
        const observacionesValue = this.ProductoForm.get('observaciones')?.value;
       if (observacionesValue === null || observacionesValue === '') {
          this.producto.observaciones = 'ninguna';
        } else {
          this.producto.observaciones = observacionesValue;
        }

        this.producto.cantidadAceptable = this.ProductoForm.get('cantidadAceptable')?.value;

        this.libroReceta.productoLibroRecetas = this.producto;

        //añadimos los insumos
        for (const insumo of this.tablaInsumos) {
          if (!this.libroReceta.insumosLibroRecetas) {
            this.libroReceta.insumosLibroRecetas = [insumo];
          } else {
            this.libroReceta.insumosLibroRecetas.push(insumo);
          }
        }

        //Añadimos el id Usuario
        const idUsuarioString = sessionStorage.getItem('idUsuario');
        if (idUsuarioString !== null) {
          this.libroReceta.idUsuario = parseInt(idUsuarioString, 10);
        }

        //Añadimos el id Usuario
        const idSucursalString = sessionStorage.getItem('idDireccionSucursal');
        if (idSucursalString !== null) {
          this.libroReceta.idSucursal = parseInt(idSucursalString, 10);
        }
        const { productoLibroRecetas, insumosLibroRecetas, idUsuario, idSucursal } = this.libroReceta;

        const body = {
          productoLibroRecetas,
          insumosLibroRecetas,
          idUsuario,
          idSucursal,
        };
        if (idProductoValue === null || idProductoValue === '') {
          //Insertar producto
          this.productoService
          .insertProducto(body)
          .then((response: any) => {
            this.limpiarCampos();
            this.getAllProductos();
            Swal.fire({
              icon: 'success',
              title: '¡Producto creado!',
              text: 'Revise la tabla de la derecha, ahi lo encontrara.',
            });
          })
          .catch((error: any) => {
            Swal.fire({
              icon: 'error',
              title: '¡Error a la hora de crear producto!',
              text: 'Cominiquese con soporte.',
            });
            console.error(error);
          })
          .finally(() => {
            this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
          });
        } else {
          //Modificar producto
          this.productoService
          .updateProducto(body)
          .then((response: any) => {
            this.limpiarCampos();
            this.getAllProductos();
            Swal.fire({
              icon: 'success',
              title: '¡Producto modificado!',
              text: 'Revise la tabla de la derecha, ahi lo encontrara.',
            });
          })
          .catch((error: any) => {
            Swal.fire({
              icon: 'error',
              title: '¡Error a la hora de modificar producto!',
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
          text: 'Agregue insumos en el boton de libro de recetas.',
        });
      }
    }
  }

  eliminarInsumo(): void {
    if (this.tablaInsumos.length > 0) {
      let precioVentaActual = parseFloat(this.ProductoForm.get('costoProduccion')?.value);
      if (isNaN(precioVentaActual)) {
        precioVentaActual = 0;
      }

      const lastInsumo = this.tablaInsumos[this.tablaInsumos.length - 1];

      if (lastInsumo && 'cantidadInsumo' in lastInsumo && 'precio' in lastInsumo) {
        const cantidadInsumo = Number(lastInsumo.cantidadInsumo);
        const precio = Number(lastInsumo.precio);

        if (!isNaN(cantidadInsumo) && !isNaN(precio)) {
          const nuevoPrecioVenta = precioVentaActual - (cantidadInsumo * precio);
          this.ProductoForm.get('costoProduccion')?.setValue(nuevoPrecioVenta.toFixed(2));
        }
      }

      this.tablaInsumos.pop();
    }
  }



  cargarFotografia(): void {
    const inputFile = document.getElementById(
      'inputFileFoto'
    ) as HTMLInputElement;
    if (inputFile.files && inputFile.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fotoB64 = e.target?.result as string;

        // Creamos un objeto Image para cargar la imagen y asegurarnos de que esté completamente cargada
        const img = new Image();
        img.onload = () => {
          const fotoPortada = document.getElementById(
            'fotoPortada'
          ) as HTMLImageElement;
          const codigoImagen = document.getElementById(
            'codigoImagen'
          ) as HTMLInputElement;

          if (fotoPortada) {
            fotoPortada.src = fotoB64;
          }
          if (codigoImagen) {
            codigoImagen.value = fotoB64;
            // Establecer el valor en el formulario
            this.ProductoForm.patchValue({ codigoImagen: fotoB64 });
            // Verificar las validaciones del formulario después de establecer el valor
            this.ProductoForm.get('codigoImagen')?.updateValueAndValidity();
          }
        };
        img.src = fotoB64;
      };

      reader.readAsDataURL(inputFile.files[0]);
    }
  }

  limpiarCampos(): void {
    // Limpiar los campos de texto
    $(
      'input[type="text"], input[type="number"], input[type="hidden"], textarea'
    ).val('');
    this.tablaInsumos = [];
    // Limpiar el atributo src de la imagen
    $('#fotoPortada').attr('src', '');
    this.ProductoForm.reset();
  }
}
