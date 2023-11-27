import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './login/auth/auth.component';
import { SignupComponent } from './login/signup/signup.component';
import { ContactComponent } from './contact/contact.component';
import { UsComponent } from './us/us.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { LoaderComponent } from './loader/loader.component';
import { DashboardComponent } from './empleadoAdministrador/dashboard/dashboard.component';
import { AuthGuardAdmin } from './authAdmin.guard';
import { ProductosComponent } from './empleadoAdministrador/productos/productos.component';
import { InsumosComponent } from './empleadoAdministrador/insumos/insumos.component';
import { ProductosPedidoComponent } from './productos-pedido/productos-pedido.component';
import { InventariosComponent } from './empleadoAdministrador/inventarios/inventarios.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ProveedorComponent } from './empleadoAdministrador/proveedores/proveedores.component';
import { UsersComponent } from './empleadoAdministrador/users/users.component';
import { ProfileComponent } from './cliente/profile/profile.component';
import { TarjetasComponent } from './cliente/profile/tarjetas/tarjetas.component';
import { ProfileUpdateComponent } from './cliente/profile/profile-update/profile-update.component';
import { AuthGuardCliente } from './authCliente.guard';
import { AuthGuardPedido } from './authEmpleadoPedido.guard';
import { AddressComponent } from './cliente/profile/address/address.component';
import { SucursalesComponent } from './empleadoAdministrador/sucursales/sucursales.component';
import { VentasComponent } from './empleadoAdministrador/ventas/ventas.component';
import { AuthGuardVenta } from './authEmpleadoVenta.guard';
import { RepartirComponent } from './empleadoRepartidor/repartir/repartir.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'us', component: UsComponent },
  { path: 'products', component: ListProductsComponent },
  { path: 'loader', component: LoaderComponent },
  { path: 'shop', component: ProductosPedidoComponent },
  {
    path: 'dashboardAdministrador',
    component: DashboardComponent,
    canActivate: [AuthGuardAdmin],
  },
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuardVenta] },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: 'insumos',
    component: InsumosComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: 'inventarios',
    component: InventariosComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: 'proveedores',
    component: ProveedorComponent,
    canActivate: [AuthGuardAdmin],
  },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardAdmin] },
  {
    path: 'sucursal',
    component: SucursalesComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardCliente],
  },
  {
    path: 'tarjetas',
    component: TarjetasComponent,
    canActivate: [AuthGuardCliente],
  },
  {
    path: 'profileUpdate',
    component: ProfileUpdateComponent,
    canActivate: [AuthGuardCliente],
  },
  {
    path: 'address',
    component: AddressComponent,
    canActivate: [AuthGuardCliente],
  },
  {
    path: 'repartir',
    component: RepartirComponent,
    canActivate: [AuthGuardPedido],
  },
  { path: 'myOrders', component: PedidosComponent },
  // Page not found
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
