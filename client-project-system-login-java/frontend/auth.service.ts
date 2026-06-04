import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Porta configurada no application.properties do Spring Boot
  private apiUrl = 'http://localhost:8081/login';

  constructor(private http: HttpClient) {}

  login(credentials: {username: string, password: string}): Observable<string> {
    // O backend retorna o token como texto puro, por isso usamos responseType: 'text'
    return this.http.post(this.apiUrl, credentials, { responseType: 'text' });
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }
}