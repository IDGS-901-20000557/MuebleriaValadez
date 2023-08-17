import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing.module';
import { DataTablesModule } from "angular-datatables";
import { AuthComponent } from './login/auth/auth.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './login/signup/signup.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './login/auth/auth.service';
import { LoaderComponent } from './loader/loader.component';
import { LoadingService } from './loading.service';
import { ListProductsComponent } from './list-products/list-products.component';
import { SignupService } from './login/signup/signup.service';
import { DashboardComponent } from './empleadoAdministrador/dashboard/dashboard.component';
import { ProductosComponent } from './empleadoAdministrador/productos/productos.component';
import { InsumosComponent } from './empleadoAdministrador/insumos/insumos.component';
import { ProductosPedidoComponent } from './productos-pedido/productos-pedido.component';
import { CarritoComponent } from './carrito/carrito.component';
import { InventariosComponent } from './empleadoAdministrador/inventarios/inventarios.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ProveedorComponent } from './empleadoAdministrador/proveedores/proveedores.component';
import { UsersComponent } from './empleadoAdministrador/users/users.component';
import { ProfileComponent } from './cliente/profile/profile.component';
import { TarjetasComponent } from './cliente/profile/tarjetas/tarjetas.component';
import { ProfileUpdateComponent } from './cliente/profile/profile-update/profile-update.component';
import { AddressComponent } from './cliente/profile/address/address.component';
import { SucursalesComponent } from './empleadoAdministrador/sucursales/sucursales.component';
import { ContactComponent } from './contact/contact.component';
import { VentasComponent } from './empleadoAdministrador/ventas/ventas.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { InventarioProductosComponent } from './empleadoAdministrador/dashboard/inventario-productos/inventario-productos.component';
import { InventarioInsumosComponent } from './empleadoAdministrador/dashboard/inventario-insumos/inventario-insumos.component';
import { MejoresClientesComponent } from './empleadoAdministrador/dashboard/mejores-clientes/mejores-clientes.component';
import { MayoresProductosComponent } from './empleadoAdministrador/dashboard/mayores-productos/mayores-productos.component';
import { MenoresProductosComponent } from './empleadoAdministrador/dashboard/menores-productos/menores-productos.component';
import { VentasMensualesComponent } from './empleadoAdministrador/dashboard/ventas-mensuales/ventas-mensuales.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    MenuComponent,
    SignupComponent,
    FooterComponent,
    ContactComponent,
    LoaderComponent,
    ListProductsComponent,
    DashboardComponent,
    ProductosComponent,
    InsumosComponent, 
    ProductosPedidoComponent,
    CarritoComponent,
    InventariosComponent,
    PageNotFoundComponent,
    PedidosComponent,
    ProveedorComponent,
    UsersComponent,
    ProfileComponent,
    TarjetasComponent,
    ProfileUpdateComponent,
    AddressComponent,
    SucursalesComponent,
    VentasComponent,
    InventarioProductosComponent,
    InventarioInsumosComponent,
    MejoresClientesComponent,
    MayoresProductosComponent,
    MenoresProductosComponent,
    VentasMensualesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule.forRoot(),
    CommonModule,
    FormsModule,
    NgxChartsModule
  ],
  providers: [AuthService, SignupService],
  bootstrap: [AppComponent]
})
export class AppModule { }
