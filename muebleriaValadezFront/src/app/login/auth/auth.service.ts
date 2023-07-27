import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const apiUrl = 'https://localhost:7010/auth/Auth/login';
    const body = {
      "email": email,
      "password": password };

    return this.http.post(apiUrl, body).toPromise();
  }
}
