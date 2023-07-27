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
import { InsumosComponent } from './insumos/insumos.component';


const routes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'us', component: UsComponent },
    { path: 'products', component: ListProductsComponent },
    { path: 'loader', component: LoaderComponent },
    { path: 'insumos', component: InsumosComponent },
    { path: 'dashboardAdministrador', component: DashboardComponent, canActivate: [AuthGuardAdmin] }

];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule{

}

