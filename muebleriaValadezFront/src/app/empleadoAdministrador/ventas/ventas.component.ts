import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/loading.service';
import { VentasService } from './ventas.service';
import { Cliente } from './cliente';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as crypto from 'crypto-js';
import { Producto } from './producto';
import { OrdenVenta } from './orden-venta';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  VentasForm!: FormGroup;
  ventasCargadas = false;
  signUpForm!: FormGroup;
  addressForm!: FormGroup;
  ProductoForm!: FormGroup;
  clientes: Cliente[] = [];
  isPasswordVisible = false;
  @ViewChild('asIcon') icono!: ElementRef;
  @ViewChild('asPassword') password!: ElementRef;
  productos: Producto[] = [];
  producto!: Producto;
  venta!: OrdenVenta;
  ventaPendiente!: OrdenVenta;
  ventas: OrdenVenta[]=[];
  tablaProductos: Producto[] = [];
  pendiente: boolean=false;

  dtOptions = {};
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private ventasService: VentasService,
    private renderer: Renderer2,
    private router: Router
  ) {}


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
        precioVenta: precio,
        cantidadProducto: cantidad,
        subtotal: cantidad*precio,
      });
      let precioVentaActual = parseFloat(this.VentasForm.get('total')?.value);
      if (isNaN(precioVentaActual)) {
        precioVentaActual = 0;
      }
      const nuevoPrecioVenta = precioVentaActual + cantidad * precio;
      this.VentasForm.get('total')?.setValue(nuevoPrecioVenta.toFixed(2));
    }
  }
  ngOnInit(): void {
    this.VentasForm = this.fb.group({});
    this.ProductoForm = this.fb.group({});

    // Inicializa DataTables en el elemento HTML de la tabla

    this.VentasForm.addControl('idVenta', this.fb.control('', []));
    this.VentasForm.addControl(
      'total',
      this.fb.control('', [Validators.required, this.validateCantidad])
    );
    this.VentasForm.addControl(
      'cliente',
      this.fb.control('', [Validators.required])
    );
    this.VentasForm.addControl(
      'tipoPago',
      this.fb.control('', [Validators.required])
    );


    // Inicializa el formulario sin controles individuales en el constructor
    this.signUpForm = this.fb.group({});





    // Agrega los controles individuales con sus validadores en el método ngOnInit
    this.signUpForm.addControl(
      'nombre',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ])
    );
    this.signUpForm.addControl(
      'apellidoP',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ])
    );
    this.signUpForm.addControl(
      'apellidoM',
      this.fb.control('', [Validators.minLength(3), Validators.maxLength(50)])
    );
    this.signUpForm.addControl(
      'telefono',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20),
      ])
    );
    this.signUpForm.addControl(
      'email',
      this.fb.control('', [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(50),
      ])
    );
    this.signUpForm.addControl(
      'password',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ])
    );
    this.signUpForm.addControl('password2', this.fb.control(''));

      this.getAllClientes();
    // this.getAllInsumos();
    // this.getAllProductos();

    this.ProductoForm.addControl(
      'producto',
      this.fb.control('', [Validators.required])
    );
    this.ProductoForm.addControl(
      'cantidad',
      this.fb.control('', [Validators.required, this.validateCantidad, Validators.pattern('^[0-9]*$')])
    );
    this.getAllProductos();
    this.getAllVentas();

    const total = document.getElementById('total') as HTMLInputElement;
    total.disabled = true;
  }

  eliminarVenta(venta:OrdenVenta): void {
    const idUser = Number(sessionStorage.getItem('idUsuario'));
    const idVenta = Number(venta.idOrdenVenta) || 0;
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
        this.ventasService.deleteVenta(idUser,idVenta).subscribe(
          () => {
            this.loadingService.hide();
            Swal.fire('¡Eliminado!', 'La venta ha sido eliminada.', 'success');
            this.getAllVentas();
            this.limpiarCampos();
          },
          (error) => {
            console.error(error);
            Swal.fire('¡Error!', 'Hubo un error al eliminar la venta.', 'error');
            this.loadingService.hide();
          }
        );
      }
    });
  }

  editarVenta(venta: OrdenVenta): void {

    this.tablaProductos = [];
    this.loadingService.show();
    const idVenta = Number(venta.idOrdenVenta) || 0;
    this.ventasService.getVenta(idVenta).subscribe(
      (venta: OrdenVenta) => {
        const tipoPagoControl = this.VentasForm.get('tipoPago');
          if (tipoPagoControl) {
            tipoPagoControl.setValue(venta.tipoPago);
          }
          this.ventaPendiente = venta;

          const cliente = this.VentasForm.get('cliente');
          if (cliente) {
            cliente.setValue(venta.idCliente);
            cliente.disable();
          }
        this.VentasForm.patchValue({
          idVenta: venta.idOrdenVenta,
          total: venta.total
        });
         if (venta.productosVenta) {
           this.tablaProductos = venta.productosVenta;
         } else {
           this.tablaProductos = [];
         }
         this.pendiente=true;

      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de consultar la venta!',
          text: 'Comuníquese con soporte.',
        });
        console.error(error);
      },
      () => {
        this.loadingService.hide();
      }
    );

  }
  getAllVentas(): void {
    this.ventasService.getAllVentas().subscribe(
      (data) => {
        this.ventas = data;
        this.inicializarDataTables();
          },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error a la hora de consultar ventas!',
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
    };
    this.ventasCargadas = true;
  }

  getAllProductos(): void {
    this.ventasService.getAllProductos().subscribe(
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

 validateCantidad(control: any) {
  const cantidadValue = control.value;

  if (cantidadValue <= 0) {
    return { cantidadInvalida: true };
  }

  return null; // La validación pasó correctamente
}

getAllClientes(): void {
  this.ventasService.getAllClientes().subscribe(
    (data) => {
      this.clientes = data;
    },
    (error) => {
      Swal.fire({
        icon: 'error',
        title: '¡Error a la hora de consultar clientes!',
        text: 'Cominiquese con soporte.',
      });
    }
  );
}

eliminarProducto(): void {
  if (this.tablaProductos.length > 0) {
    let precioVentaActual = parseFloat(this.VentasForm.get('total')?.value);
    if (isNaN(precioVentaActual)) {
      precioVentaActual = 0;
    }

    const lastProducto = this.tablaProductos[this.tablaProductos.length - 1];

    if (
      lastProducto &&
      'cantidadProducto' in lastProducto &&
      'precioVenta' in lastProducto
    ) {
      const cantidadProducto = Number(lastProducto.cantidadProducto);
      const precio = Number(lastProducto.precioVenta);

      if (!isNaN(cantidadProducto) && !isNaN(precio)) {
        const nuevoPrecioVenta =
          precioVentaActual - cantidadProducto * precio;
        this.VentasForm.get('total')?.setValue(nuevoPrecioVenta.toFixed(2));
      }
    }

    this.tablaProductos.pop();
  }
}

printVenta(venta: OrdenVenta) {
  let pdf = new jsPDF();
  this.loadingService.show();
  const idLote = Number(venta.idOrdenVenta) || 0;
  this.ventasService.getVenta(idLote).subscribe(
    (ventaPrincipal: OrdenVenta) => {
      let productosTable = `
        <table style="width: 100%;">
          <tr>
            <th style="text-align: center; font-size: 3px; ">Producto</th>
            <th style="text-align: center; font-size: 3px; ">Cantidad</th>
            <th style="text-align: center; font-size: 3px;">Precio</th>
            <th style="text-align: center; font-size: 3px; ">Total</th>
          </tr>`;

      if (ventaPrincipal.productosVenta) {
        for (const producto of ventaPrincipal.productosVenta) {
          let costoTotal = 0;
          costoTotal =
          producto.precioVenta && producto.cantidadProducto
              ? producto.precioVenta * producto.cantidadProducto
              : 0;

              productosTable += `
            <tr>
              <td style="font-size: 3px; text-align: center; ">${producto.nombreProducto}</td>
              <td style="text-align: center; font-size: 3px;">${
                producto.cantidadProducto
              }</td>
              <td style="text-align: center; font-size: 3px;">$${
                producto.precioVenta
              }</td>
              <td style="text-align: center; font-size: 3px;">$${costoTotal.toFixed(
                2
              )}</td>
            </tr>`;
        }
      }else {
        productosTable += `
          <tr>
            <td colspan="4" style="text-align: center; font-size: 3px;">No hay productos en esta venta.</td>
          </tr>`;
      }

      productosTable += `</table>`;

      pdf.html(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        </head>
        <body>
          <div class="ticket" style="width: 100px; margin: 10px 0 0 55px; border: 2px solid #333; border-radius: 10px; padding: 10px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); background-color: #fff;">
            <div class="header" style="text-align: center; margin-bottom: 5px;">
              <div class="title" style="font-size: 8px; font-weight: bold;">Ticket de Compra</div>
            </div>
            <div class="details" >
              ${productosTable}
            </div>
            <div  style="margin-top: 2px; text-align: right; font-weight: bold; font-size: 6px;">Total: $${ventaPrincipal.total}</div>
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


  agregarVenta() : void{
    if (this.VentasForm.valid) {
      if (this.tablaProductos.length > 0) {
        this.loadingService.show();
        this.venta = {};
        const idVentaValue = this.VentasForm.get('idVenta')?.value;
        this.venta.idOrdenVenta = idVentaValue ? parseInt(idVentaValue, 10) : 0;

        const idUsuarioString = sessionStorage.getItem('idUsuario');
        if (idUsuarioString !== null) {
          this.venta.IdUsuario =  parseInt(idUsuarioString, 10);
        }

        const idEmpleadoString = sessionStorage.getItem('idEmpleado');
        if (idEmpleadoString !== null) {
          this.venta.IdEmpleadoMostrador =  parseInt(idEmpleadoString, 10);
        }

        this.venta.total =this.VentasForm.get('total')?.value;
        this.venta.idCliente =this.VentasForm.get('cliente')?.value;

        const idSucursalString = sessionStorage.getItem('idDireccionSucursal');
        if (idSucursalString !== null) {
          this.venta.IdDireccion =  parseInt(idSucursalString, 10);
        }

        this.venta.tipoPago =this.VentasForm.get('tipoPago')?.value;

        //añadimos los productos
        for (const producto of this.tablaProductos) {
          if (!this.venta.productosVenta) {
            this.venta.productosVenta = [producto];
          } else {
            this.venta.productosVenta.push(producto);
          }
        }

        if (idVentaValue === null || idVentaValue === '') {
          this.ventasService
          .insertVenta(this.venta)
          .then((response: any) => {
            this.limpiarCampos();
             this.getAllVentas();
            Swal.fire({
              icon: 'success',
              title: '¡Venta creada!',
              text: 'Revise la tabla de la derecha, ahi lo encontrara.',
            });
          })
          .catch((error: any) => {
            Swal.fire({
              icon: 'error',
              title: '¡Error a la hora de crear la venta!',
              text: 'Cominiquese con soporte.',
            });
            console.error(error);
          })
          .finally(() => {
            this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
          });
        }else{
          this.ventasService
          .updateVenta(this.venta)
          .then((response: any) => {
            this.limpiarCampos();
             this.getAllVentas();
            Swal.fire({
              icon: 'success',
              title: '¡Venta modificada!',
              text: 'Revise la tabla de la derecha, ahi lo encontrara.',
            });
          })
          .catch((error: any) => {
            Swal.fire({
              icon: 'error',
              title: '¡Error a la hora de modificar la venta!',
              text: 'Cominiquese con soporte.',
            });
            console.error(error);
          })
          .finally(() => {
            this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
          });
        }

      }else {
        Swal.fire({
          icon: 'info',
          title: '¡Debe haber al menos un producto!',
          text: 'Agregue productos en el boton Productos.',
        });
      }
    }
  }

  limpiarCampos(): void {
    // Limpiar los campos de texto
    $(
      'input[type="text"], input[type="number"], input[type="hidden"], textarea'
    ).val('');
     this.tablaProductos = [];

     const cliente = this.VentasForm.get('cliente');
          if (cliente) {
            cliente.enable();
          }
          this.pendiente=false;

    this.VentasForm.reset();
  }

  entregarVenta(): void{
    const idUser = Number(sessionStorage.getItem('idUsuario'));
    const idEmpleado = Number(sessionStorage.getItem('idEmpleado'));
    this.ventaPendiente.IdUsuario = idUser;
    this.ventaPendiente.IdEmpleadoMostrador = idEmpleado;
    this.loadingService.show();
    this.ventasService
    .entregarVentaProducto(this.ventaPendiente)
    .then((response: any) => {
      if (response.startsWith("FALTA")) {
        const insumoNombre = response.split(": ")[1];
        Swal.fire({
            icon: 'info',
            title: 'Falta Producto',
            text: `Falta inventario del producto: ${insumoNombre}`,
        });
    }else{
       this.printVenta(this.ventaPendiente);
      this.limpiarCampos();
      this.getAllVentas();
      Swal.fire({
        icon: 'success',
        title: 'Venta entregada!',
        text: 'Revise la tabla de la derecha, ahi lo encontrara.',
      });
     }
    })
    .catch((error: any) => {
      Swal.fire({
        icon: 'error',
        title: '¡Error a la hora de entregar venta!',
        text: 'Cominiquese con soporte.',
      });
      console.error(error);
    })
    .finally(() => {
      this.loadingService.hide();
    });
  }


  onSubmit() {
    console.log(this.signUpForm.get('password')?.value);
    console.log(this.signUpForm.get('password2')?.value);
    if (this.signUpForm.valid) {
      if(this.signUpForm.get('password')?.value != this.signUpForm.get('password2')?.value){
        Swal.fire({
          icon: 'info',
          title: 'Contraseñas incorrectas',
          text: 'Las contraseñas ingresas no coinciden. Intente de nuevo.',
          confirmButtonColor: '#20a124',
          confirmButtonText: 'Aceptar',
        });
      }
      else if (
        this.signUpForm.get('password')?.value ==
        this.signUpForm.get('password2')?.value
      ) {
        this.ventasService.userFind(this.signUpForm.get('email')?.value)
          .then((result: any) => {
            // 'result' contiene el resultado como texto (puede ser "true" o "false")
            const exists = JSON.parse(result); // Convierte el texto a un valor booleano
            console.log(exists.exists);
            if (exists.exists) {
              Swal.fire({
                icon: 'warning',
                title: '¡Elija otro correo!',
                text: 'El correo ingresado ya se encuentra registrado.',
                confirmButtonColor: '#20a124',
                confirmButtonText: 'Aceptar',
              });
            } else {
              this.loadingService.show();
              const nombre = this.signUpForm.get('nombre')?.value;
              const apellidoP = this.signUpForm.get('apellidoP')?.value;
              const apellidoM = this.signUpForm.get('apellidoM')?.value;
              const telefono = this.signUpForm.get('telefono')?.value;
              const email = this.signUpForm.get('email')?.value;
              const password = crypto
                .SHA512(this.signUpForm.get('password')?.value)
                .toString();
              this.loadingService.show();
              this.ventasService
                .signUp(nombre, apellidoP, apellidoM, telefono, email, password)
                .then((response: any) => {
                  this.limpiarCampos();
                  Swal.fire({
                    icon: 'success',
                    title: '¡Usuario creado!',
                    text: '¡Bienvenido!', // Muestra una barra de progreso durante el tiempo de espera
                    showConfirmButton: true // No muestra el botón de confirmación para cerrar el mensaje
                  });
                })
                .catch((error: any) => {

                  Swal.fire({
                    icon: 'error',
                    title: '¡Error a la hora de crear usuario!',
                    text: 'Ocurrió un error al crear el usuario.',
                  });
                })
                .finally(() => {
                  this.loadingService.hide(); // Ocultar el loader, tanto si hay éxito como error
                });
            }
          })
          .catch((error: any) => {
            Swal.fire({
              icon: 'error',
              title: '¡Error a la hora de crear usuario!',
              text: 'Ocurrió un error al crear el usuario.',
            });
          });

      }
    }
  }

  changeIcon(): void {
    const asIcon = this.icono.nativeElement;
    const asPassword = this.password.nativeElement;

    if (this.isPasswordVisible) {
      this.renderer.setAttribute(asPassword, 'type', 'password');
      this.renderer.removeClass(asIcon, 'fa-eye-slash');
      this.renderer.addClass(asIcon, 'fa-eye');
      console.log(asIcon);
    } else {
      this.renderer.setAttribute(asPassword, 'type', 'text');
      this.renderer.removeClass(asIcon, 'fa-eye');
      this.renderer.addClass(asIcon, 'fa-eye-slash');
      console.log(asIcon);
    }

    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Validaciones del formulario crear cuenta antes de enviarlo
  initForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      apellidoP: ['', [Validators.required, Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
      email: ['', Validators.required, Validators.minLength(10), Validators.maxLength(100)],
      password:['', Validators.required, Validators.minLength(3)]
    });
  }
}
