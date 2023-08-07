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
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ProveedorComponent } from './empleadoAdministrador/proveedores/proveedores.component';
import { SucursalesComponent } from './empleadoAdministrador/sucursales/sucursales.component';
import { ContactComponent } from './contact/contact.component';


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
    PageNotFoundComponent,
    PedidosComponent,
    ProveedorComponent,
    SucursalesComponent
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
    FormsModule
  ],
  providers: [AuthService, SignupService],
  bootstrap: [AppComponent]
})
export class AppModule { }
