import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService, Client } from './client.service';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {
  clients: Client[] = [];
  newClientName = '';
  editingClient: Client | null = null;
  errorMessage = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.findAll().subscribe({
      next: (data) => this.clients = data,
      error: (err) => this.errorMessage = 'Erro ao carregar clientes.'
    });
  }

  saveClient() {
    if (!this.newClientName.trim()) return;

    if (this.editingClient && this.editingClient.id) {
      this.clientService.update(this.editingClient.id, this.newClientName).subscribe({
        next: () => {
          this.loadClients();
          this.cancelEdit();
        }
      });
    } else {
      this.clientService.create({ name: this.newClientName }).subscribe({
        next: () => {
          this.loadClients();
          this.newClientName = '';
        }
      });
    }
  }

  editClient(client: Client) {
    this.editingClient = client;
    this.newClientName = client.name;
  }

  cancelEdit() {
    this.editingClient = null;
    this.newClientName = '';
  }

  deleteClient(id: number) {
    if (confirm('Deseja realmente excluir este cliente?')) {
      this.clientService.delete(id).subscribe({
        next: () => this.loadClients()
      });
    }
  }
}