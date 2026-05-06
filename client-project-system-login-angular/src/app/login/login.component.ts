import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from '../model/Login';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  titleImage = 'assets/Icons/titulo.png';

  constructor(
   private http: HttpClient,
   private router: Router // <-- INJEÇÃO DO ROUTER
 ) { }

  login = new Login();

  currentForm: String = 'home';

  submitted = false;
  response: string | null = null;

  API_BACKEND_URL: string = 'http://localhost:8081/login';


  clearForm() {
    this.login = new Login();
  }

  async submitForm() {
    try {
      if (this.login.username.trim() != '' && this.login.password.trim() != '') {
        
        const response = await firstValueFrom(this.http
          .post(`${this.API_BACKEND_URL}`, this.login, { responseType: 'text' as 'json' }));
        console.log('Create response:', response);
        if (response != null) {

          console.log('Login bem-sucedido. Token:', response);

          // 1. Armazene o token
          localStorage.setItem('jwtToken', String(response));

          this.router.navigate(['/home']); 


          //this.clearForm();
          //this.submitted = true;
          //this.response = 'Login bem-sucedido!';
        }

      } else {
        if (this.login.username.trim() == '') {
          alert("Informe o usuário.");
        } else if (this.login.password.trim() == '') {
          alert("Informe a senha.");
        }
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      this.response = 'Erro na requisição';
      alert("Usuário ou senha incorretos.");
    }
  }
}