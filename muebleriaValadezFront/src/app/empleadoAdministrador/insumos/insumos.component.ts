import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsumoService } from './insumo.service';
import { Insumo } from './insumo';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.component.html',
  styleUrls: ['./insumos.component.css']
})
export class InsumosComponent implements OnInit {
  insumoForm!: FormGroup;
  insumos: Insumo[] = [];
  proveedores: any[] = [];
  
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

  selectedProveedorId: number = 0; // Variable para almacenar el id del proveedor seleccionado
  modoEdicion: boolean = false; // Establecer el modo de edición como falso por defecto

  constructor(private insumoService: InsumoService, private readonly fb: FormBuilder) {
    this.insumoForm = this.initForm();
    this.nuevoInsumo = { 
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
  }

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
    // Cargar todos los proveedores al iniciar el componente
    this.getAllProveedores();
    // Valor predeterminado para el proveedor seleccionado
    this.selectedProveedorId = 0;
    
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

  // Método para obtener todos los proveedores
  getAllProveedores(): void {
    this.insumoService.getAllProveedores().subscribe(
      (data) => {
        this.proveedores = data;
        console.log(this.proveedores);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onProveedorSelected(event: any): void {
    this.selectedProveedorId = event.target.value ? Number(event.target.value) : 0;
  }
  

  // Insertar o actualizar un nuevo insumo
  insertNewInsumo(): void {
    if (this.insumoForm.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Complete todos los campos requeridos y asegúrese de que las cantidades sean mayores o iguales a 0.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    this.nuevoInsumo.idProveedor = this.selectedProveedorId; // Asignar el id del proveedor seleccionado al nuevo insumo
    const idUser = sessionStorage.getItem('idUsuario');
    const idUsuario = idUser ? parseInt(idUser, 10) : 0;
    if (this.modoEdicion) {
      // Modo edición: actualizar el insumo existente
      this.insumoService.updateInsumo(this.nuevoInsumo.idInsumo, this.nuevoInsumo, idUsuario).subscribe(
        (response) => { 
          this.modoEdicion = false;
          Swal.fire({
            title: '¡Actualización exitosa!',
            text: 'Los datos del insumo han sido actualizados.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.getAllInsumos();
          this.clearForm();
        },
        (error) => {
          console.error(error);        
        }
      );
    } else {
      // Modo inserción: insertar un nuevo insumo
      this.insumoService.insertInsumo(this.nuevoInsumo, this.selectedProveedorId, idUsuario).subscribe(
        (response) => {
          this.insumos.push(response);
          this.clearForm();
          Swal.fire({
            title: '¡Éxito!',
            text: 'El insumo ha sido insertado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        },
        (error) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Ha ocurrido un error al insertar el insumo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }
  }
  
  // Método para limpiar el campo
  clearForm(): void {
    this.nuevoInsumo = {
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
    this.selectedProveedorId = 0;
  }  

  getNombreProveedorById(idProveedor: number): string {
    const proveedor = this.proveedores.find((proveedor) => proveedor.idProveedor === idProveedor);
    return proveedor ? proveedor.nombreEmpresa : '';
  }

  // Editar el insumo seleccionado
  editarInsumo(insumo: Insumo): void {
    this.nuevoInsumo = { ...insumo }; // Copiar los datos del insumo seleccionado al nuevoInsumo
    this.selectedProveedorId = insumo.idProveedor; // Asignar el id del proveedor seleccionado al campo correspondiente
    this.modoEdicion = true; // Establecer el modo de edición
  }
  

  // Eliminar el insumo seleccionado
  deleteInsumo(id: number): void {
    const idUser = sessionStorage.getItem('idUsuario');
    const idUsuario = idUser ? parseInt(idUser, 10) : 0;
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
        this.insumoService.deleteInsumo(id, idUsuario).subscribe(
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

  // Validaciones del formulario insumo antes de enviarlo
  initForm(): FormGroup {
    return this.fb.group({
      nombreInsumo: ['', [Validators.required, Validators.minLength(3)]],
      precio: ['', [Validators.required, Validators.min(1)]],
      observaciones: ['', [Validators.required, Validators.minLength(10)]],
      cantidadAceptable: ['', [Validators.required, Validators.min(1)]],
      idProveedor: [0, Validators.required],
      unidad:['', Validators.required]
    });
  }
}
