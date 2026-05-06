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
  actionSelected: number | null = null;

  API_BACKEND_URL: string = 'http://localhost:8081/';

  searchIcon = 'assets/Icons/search.png';
  removeIcon = 'assets/Icons/remove.png';

  @ViewChild(ClientTableSelectorComponent) tableClients!: ClientTableSelectorComponent;
  @ViewChild(StatusTableSelectorComponent) tableStatus!: StatusTableSelectorComponent;

  project: Project = new Project();

  projects: Project[] = [];

  ActionTable = {
    EXCLUIR: { id: 0, description: 'Excluir' },
    EXPORTAR: { id: 1, description: 'Exportar' }
  } as const;

  actionTableList = Object.values(this.ActionTable);

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
      const client: any = await firstValueFrom(this.http.get(`${this.API_BACKEND_URL}clients/${this.project.client.id}`));
      this.project.client = client;
    } catch (error) {
      this.response = 'Erro ao buscar o cliente';
      this.project.client = new Client();
    }
  }

  async loadStatus() {
    try {
      const status: any = await firstValueFrom(this.http.get(`${this.API_BACKEND_URL}status/${this.project.status.id}`));
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
      if (this.project.id == null || this.project.id == null) {
        const created: any = await firstValueFrom(this.http.post(`${this.API_BACKEND_URL}projects`, this.project));
        this.projects.push(created);
      } else {
        await firstValueFrom(this.http.put(`${this.API_BACKEND_URL}projects`, this.project));
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
      const projects: any = await firstValueFrom(this.http.get(`${this.API_BACKEND_URL}projects/all`));
      this.projects = projects;
    } catch (error) {
      console.error('Erro ao buscar os projetos', error);
    }
  }

  async onSelectAction() {
    const table = document.getElementById('tableProjects')!;
    const checkboxes = table.querySelectorAll<HTMLInputElement>('.checkboxRemove:checked');
    const ids = Array.from(checkboxes).map(cb => cb.closest('tr')!.cells[0].textContent!);
    const action = Number(this.actionSelected);
    setTimeout(() => {
    this.actionSelected = null;
  }, 0);
    if (ids.length > 0) {
      if (action === this.ActionTable.EXCLUIR.id){
          await firstValueFrom(this.http.post(`${this.API_BACKEND_URL}projects/delete`, ids));
          // 3. Removemos todos da lista local de uma vez só
          this.projects = this.projects.filter(p => !ids.includes(String(p.id)));
      } else {
        await firstValueFrom(this.http.post(`${this.API_BACKEND_URL}projects/export`, ids));
      }
    }
  }

  updateActivities(activities: any[]) {
    this.project.activities = [...activities];
    this.showActivities = false;
  }
}
