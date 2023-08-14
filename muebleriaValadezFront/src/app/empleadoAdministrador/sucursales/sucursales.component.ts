import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalService } from './sucursal.service';
import { Sucursal } from './sucursal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css']
})
export class SucursalesComponent implements OnInit {
  sucursalForm!: FormGroup;
  sucursales: Sucursal[] = [];
  estados: string[] = [];
  ciudades: string[] = [];
  codigosPostales: number[] = [];
  colonias: any = {};

  selectedEstado: string = '';
  selectedCiudad: string = '';
  selectedCodigoPostal: number = 0;
  selectedColonia: any = {};

  // Variables para el formulario de inserción
  nuevaSucursal: Sucursal = {
    razonSocial: '',
    idSucursal: 0,
    estatus: '1',
    direccion: {
      idDireccion: 0,
      calle: '',
      noExt: 0,
      idDomicilio: 0
    }
  };

  modoEdicion: boolean = false;

  constructor(private sucursalService: SucursalService, private readonly fb: FormBuilder) {
    this.sucursalForm = this.initForm();
    this.nuevaSucursal = {
      razonSocial: '',
      idSucursal: 0,
      estatus: '1',
      direccion: {
        idDireccion: 0,
        calle: '',
        noExt: 0,
        idDomicilio: 0
      }
    };
  }

  // Validaciones del formulario sucursal antes de enviarlo
  initForm(): FormGroup {
    return this.fb.group({
      razonSocial: ['', [Validators.required, Validators.minLength(5)]],
      calle: ['', [Validators.required, Validators.minLength(5)]],
      noExt: [0, [Validators.required, Validators.min(1)]],
      noInt: []
    });
  }

  ngOnInit(): void {
    // Cargar todos las sucursales al iniciar el componente
    this.getAllSucursales();
    // Cargar la lista de estados al iniciar el componente
    this.getEstados();
  }

  // Obtener todos las sucursales activas
  getAllSucursales(): void {
    this.sucursalService.getAllSucursales().subscribe(
      (data) => {
        this.sucursales = data.filter((sucursal) => sucursal.estatus === "1");
        console.log(this.sucursales);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Obtener la lista de estados
  getEstados(): void {
    this.sucursalService.getEstados().subscribe(
      (data) => {
        this.estados = data.sort();
        //console.log(this.estados);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Obtener las ciudades dependiendo del estado
  getCiudadesByEstado(): void {
    this.sucursalService.getCiudadesByEstado(this.selectedEstado).subscribe(
      (data) => {
        this.ciudades = data.sort();
        this.codigosPostales = [];
        this.colonias = [];
        this.selectedCiudad = '';
        this.selectedCodigoPostal = 0;
        this.selectedColonia = [];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Obtener los códigos postales dependiendo de la ciudad seleccionada
  getCodigosPostalesByCiudad(): void {
    this.sucursalService.getCodigosPostalesByCiudad(this.selectedCiudad).subscribe(
      (data) => {
        this.codigosPostales = data.sort(); // Ordena numéricamente
        this.selectedCodigoPostal = 0;
        this.colonias = [];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Obtener por último la colonia dependiendo del código postal
  getColoniasByCodigoPostal(): void {
    this.sucursalService.getColoniasByCodigoPostal(this.selectedCodigoPostal).subscribe(
      (data) => {
        this.colonias = data.sort(); // Ordena alfabéticamente
        this.selectedColonia = null;
        //console.log(this.colonias);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Insertar o actualizar una nueva sucursal
  insertNewSucursal(): void {
    if (this.sucursalForm.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Complete todos los campos requeridos y asegúrese de que los números sean mayores o iguales a 1.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#20a124'
      });
      return;
    }
    this.nuevaSucursal.direccion.idDomicilio = this.selectedColonia;
    const idUser = sessionStorage.getItem('idUsuario');
    const idUsuario = idUser ? parseInt(idUser, 10) : 0;
    if (this.modoEdicion) {
      // Modo edición: actualizar la sucursal existente
      this.sucursalService.updateSucursal(this.nuevaSucursal.idSucursal, this.nuevaSucursal,  idUsuario, this.nuevaSucursal.direccion.idDireccion, this.nuevaSucursal.direccion.idDomicilio).subscribe(
        (response) => { 
          this.modoEdicion = false;
          Swal.fire({
            title: '¡Actualización exitosa!',
            text: 'Los datos de la sucursal han sido actualizados.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#20a124'

          });
          this.getAllSucursales();
          this.clearForm();
        },
        (error) => {
          console.error(error);        
        }
      );
    } else {
      // Modo inserción: insertar una nueva sucursal
      //console.log(this.nuevaSucursal.direccion.idDomicilio);
      this.sucursalService.insertSucursal(this.nuevaSucursal, idUsuario, this.nuevaSucursal.direccion.idDomicilio).subscribe(
        (response) => {
          this.sucursales.push(response);
          this.clearForm();
          Swal.fire({
            title: '¡Éxito!',
            text: 'La sucursal ha sido insertada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#20a124'

          });
          this.getAllSucursales();
        },
        (error) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Ha ocurrido un error al insertar la sucursal.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#20a124'

          });
          console.log(error);
        }
      );
    }
  }
  
  // Método para limpiar el campo
  clearForm(): void {
    this.nuevaSucursal = {
      razonSocial: '',
      idSucursal: 0,
      direccion: {
        calle: '',
        noExt: 0,
        noInt: 0,
        idDireccion: 0,
        idDomicilio: 0
      },
      estatus: '1'
    };
    
  }  

  // Editar la sucursal seleccionada
  editarSucursal(sucursal: Sucursal): void {
    this.nuevaSucursal = { ...sucursal }; // Copiar los datos de la sucursal seleccionado al nuevaSucursal para su visualización y edición
    this.modoEdicion = true; // Establecer el modo de edición
  }

  // Eliminar la sucursal seleccionada
  deleteSucursal(id: number): void {
    const idUser = sessionStorage.getItem('idUsuario');
    const idUsuario = idUser ? parseInt(idUser, 10) : 0;
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sucursalService.deleteSucursal(id, idUsuario).subscribe(
          () => {
            this.sucursales = this.sucursales.filter(sucursal => sucursal.idSucursal !== id);
            Swal.fire('¡Eliminado!', 'La sucursal ha sido eliminada.', 'success');
          },
          (error) => {
            console.error(error);
            Swal.fire('¡Ocurrió un error!', 'No se pudo eliminar la sucursal.', 'error');
          }
        );
      }
    });
  }

}
