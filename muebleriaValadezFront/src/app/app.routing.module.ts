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
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PedidosComponent } from './pedidos/pedidos.component';


const routes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'us', component: UsComponent },
    { path: 'products', component: ListProductsComponent },
    { path: 'loader', component: LoaderComponent },
    { path: 'shop', component: ProductosPedidoComponent },
    { path: 'dashboardAdministrador', component: DashboardComponent, canActivate: [AuthGuardAdmin] },
    { path: 'productos', component: ProductosComponent, canActivate: [AuthGuardAdmin] },
    { path: 'insumos', component: InsumosComponent, canActivate: [AuthGuardAdmin] },
    { path: 'dashboardAdministrador', component: DashboardComponent, canActivate: [AuthGuardAdmin] },
    { path: 'myOrders', component: PedidosComponent},
    // Page not found
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule{

}

