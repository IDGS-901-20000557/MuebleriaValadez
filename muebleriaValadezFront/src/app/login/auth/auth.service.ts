import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const apiUrl = 'https://localhost:7010/auth/Auth/login';
    const body = {
      "idUsuario": 0,
      "email": email,
      "password": password,
    "persona": {
      "idPersona": 0,
    "nombres": "string",
    "apellidoPaterno": "string",
    "apellidoMaterno": "string",
    "telefono": "string"
    },
    "estatus": "1" };

    return this.http.post(apiUrl, body).toPromise();
  }
}
