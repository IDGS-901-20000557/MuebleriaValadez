import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";


@Injectable()
export class SignupService {
  constructor(private http: HttpClient) {}

  signUp(nombre: string, apellidoP: string, apellidoM: string, telefono: string,email: string, password: string) {
    const apiUrl = 'https://localhost:7010/auth/Auth';
    const body = {
      "email": email,
      "password": password,
    "persona":{
      "nombres": nombre,
    "apellidoPaterno": apellidoP,
    "apellidoMaterno": apellidoM,
    "telefono": telefono
    }};

    return this.http.post(apiUrl, body, { responseType: 'text' }).toPromise();
  }
  userFind(email: string) {
    const apiUrl = 'https://localhost:7010/auth/Auth/userFind';
    const body = {
      "email": email
    };
    return this.http.post(apiUrl, body, { responseType: 'text' }).toPromise();
  }
}
