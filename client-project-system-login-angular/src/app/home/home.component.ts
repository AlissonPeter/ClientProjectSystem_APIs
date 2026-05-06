import { Component } from '@angular/core';
import { ClientFormComponent } from './client-form/client-form.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { StatusFormComponent } from './status-form/status-form.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "../login/login.component";
import { Router } from '@angular/router';

enum Forms {
  CLIENT = 'client',
  PROJECT = 'project',
  STATUS = 'status',
  LOGIN = 'login'
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, ClientFormComponent, ProjectFormComponent, StatusFormComponent, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly Forms = Forms;
  currentForm: Forms = Forms.CLIENT;

  titleImage = 'assets/Icons/titulo.png';

  constructor(private router: Router) { }

  setCurrentForm(form: Forms) {
    this.currentForm = form;
  }

  logout() {
    localStorage.removeItem('jwtToken');
    //Redirecionar para a rota de Login
    this.router.navigate(['/login'])
      .then(() => {
        console.log("Usuário deslogado e redirecionado para login.");
      })
      .catch(err => {
        console.error("Erro ao redirecionar após logout:", err);
      });
  }
}
