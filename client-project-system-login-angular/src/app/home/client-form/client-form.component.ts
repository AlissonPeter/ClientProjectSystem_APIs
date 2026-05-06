import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ClientTableSelectorComponent } from '../client-table-selector/client-table-selector.component';
import { Client } from '../../model/Client';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientTableSelectorComponent],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {
  client = new Client();

  submitted = false;
  response: string | null = null;

  API_BACKEND_URL: string = 'http://localhost:8081/';

  @ViewChild(ClientTableSelectorComponent) tableClients!: ClientTableSelectorComponent;

  constructor(private http: HttpClient) {}

  handleSelected(clientSelected: Client) {
    this.client = Object.assign(new Client(), clientSelected);
  }

  clearForm() {
    this.client = new Client();
  }

  async submitForm() {
    try {
      if (!this.client.id) {
        const response = await firstValueFrom(this.http
          .post(`${this.API_BACKEND_URL}clients`, this.client));
        console.log('Create response:', response);
      } else {
        await firstValueFrom(
          this.http.put(`${this.API_BACKEND_URL}clients/${this.client.id}?name=${this.client.name}`, {}));
        console.log('Update client:', this.client.id);
      }
      this.tableClients.getClients();
      this.clearForm();
      this.submitted = true;
      this.response = '';

      // Atualiza a lista de clientes
      setTimeout(() => {
        this.submitted = false;
      }, 3000);
    } catch (error) {
      console.error('Erro na requisição:', error);
      this.response = 'Erro na requisição';
    }
  }
}
