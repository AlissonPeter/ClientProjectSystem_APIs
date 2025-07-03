import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientTableSelectorComponent } from '../client-table-selector/client-table-selector.component';
import { StatusTableSelectorComponent } from '../status-table-selector/status-table-selector.component';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { Project } from '../../model/Project';
import { Client } from '../../model/Client';
import { Status } from '../../model/Status';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
  standalone: true,
  imports: [ClientTableSelectorComponent, StatusTableSelectorComponent, ActivityFormComponent, CommonModule, FormsModule]
})

export class ProjectFormComponent implements OnInit {
  showTableClients = false;
  showTableStatus = false;
  showActivities = false;
  submitted = false;
  response: string | null = null;

  searchIcon = 'assets/Icons/search.png';
  removeIcon = 'assets/Icons/remove.png';

  @ViewChild(ClientTableSelectorComponent) tableClients!: ClientTableSelectorComponent;
  @ViewChild(StatusTableSelectorComponent) tableStatus!: StatusTableSelectorComponent;

  project: Project = new Project();

  projects: Project[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getProjects();
  }

  toggleTableClients() {
    this.showTableClients = true;
  }

  toggleTableStatus() {
    this.showTableStatus = true;
  }

  handleClientSelected(client: any) {
    this.project.client = { ...client };
    this.showTableClients = false;
  }

  handleStatusSelected(status: any) {
    this.project.status = { ...status };
    this.showTableStatus = false;
  }

  blockSigns(event: KeyboardEvent) {
    if (event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }

  clearForm() {
    this.project = new Project();
  }

  setProject(project: any) {
    this.project = { ...project };
  }

  async loadClient() {
    try {
      const client: any = await firstValueFrom(this.http.get(`http://localhost:8081/clients/${this.project.client.id}`));
      this.project.client = client;
    } catch (error) {
      this.response = 'Erro ao buscar o cliente';
      this.project.client = new Client();
    }
  }

  async loadStatus() {
    try {
      const status: any = await firstValueFrom(this.http.get(`http://localhost:8081/status/${this.project.status.id}`));
      this.project.status = status;
    } catch (error) {
      this.response = 'Erro ao buscar o status';
      this.project.status = new Status();
    }
  }

  async submitForm(event: Event) {
    event.preventDefault();
    this.submitted = true;
    try {
      console.log(JSON.stringify(this.project));
      if (this.project.id == null || this.project.id == "") {
        const created: any = await firstValueFrom(this.http.post(`http://localhost:8081/projects`, this.project));
        this.projects.push(created);
      } else {
        await firstValueFrom(this.http.put(`http://localhost:8081/projects`, this.project));
        const index = this.projects.findIndex(p => p.id === this.project.id);
        this.projects[index] = { ...this.project };
      }
      this.clearForm();
    } catch (error) {
      this.response = 'Erro na requisição';
      console.error('Erro ao salvar o projeto', error);
    }

    setTimeout(() => {
      this.submitted = false;
    }, 3000);
  }

  async getProjects() {
    try {
      const projects: any = await firstValueFrom(this.http.get(`http://localhost:8081/projects/all`));
      this.projects = projects;
    } catch (error) {
      console.error('Erro ao buscar os projetos', error);
    }
  }

  async deleteProjectsSelected() {
    const table = document.getElementById('tableProjects')!;
    const checkboxes = table.querySelectorAll<HTMLInputElement>('.checkboxRemove:checked');
    const ids = Array.from(checkboxes).map(cb => cb.closest('tr')!.cells[0].textContent!);
    for (const id of ids) {
      await await firstValueFrom(this.http.delete(`http://localhost:8081/projects/${id}`));
      this.projects = this.projects.filter(p => p.id != id);
    }
  }

  updateActivities(activities: any[]) {
    this.project.activities = [...activities];
    this.showActivities = false;
  }
}
