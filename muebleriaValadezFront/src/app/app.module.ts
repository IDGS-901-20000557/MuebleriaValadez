import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    MenuComponent,
    SignupComponent,
    FooterComponent,
    LoaderComponent,
    ListProductsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule.forRoot(),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
