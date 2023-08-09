import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { TarjetasComponent } from './tarjetas/tarjetas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressComponent } from './address/address.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
// Asegúrate de importar el módulo ReactiveFormsModule

@NgModule({
  declarations: [
    ProfileComponent,
    TarjetasComponent,
    AddressComponent,
    ProfileUpdateComponent // Asegúrate de incluir el componente Tarjetas en la lista de declaraciones
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule // Asegúrate de importar el módulo ReactiveFormsModule
  ]
})
export class ProfileModule { }
