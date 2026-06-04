import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (token) => {
        this.authService.saveToken(token);
        // Redireciona para a gestão de clientes após sucesso
        this.router.navigate(['/clients']); 
      },
      error: (err) => {
        this.errorMessage = 'Usuário ou senha inválidos.';
        console.error('Erro de login:', err);
      }
    });
  }
}