import { Component } from '@angular/core';
import { ClientFormComponent } from './client-form/client-form.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { StatusFormComponent } from './status-form/status-form.component';
import { CommonModule } from '@angular/common';

enum Forms {
  CLIENT = 'client',
  PROJECT = 'project',
  STATUS = 'status'
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, ClientFormComponent, ProjectFormComponent, StatusFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly Forms = Forms;
  currentForm: Forms = Forms.CLIENT;

  titleImage = 'assets/Icons/titulo.png';

  setCurrentForm(form: Forms) {
    this.currentForm = form;
  }
}
