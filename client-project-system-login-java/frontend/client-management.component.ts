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
        next: () => {
          this.selectedClientIds.delete(id);
          this.loadClients();
        }
      });
    }
  }

  // Lógica para seleção múltipla
  selectedClientIds: Set<number> = new Set();

  toggleSelect(clientId: number) {
    if (this.selectedClientIds.has(clientId)) {
      this.selectedClientIds.delete(clientId);
    } else {
      this.selectedClientIds.add(clientId);
    }
  }

  isClientSelected(clientId: number): boolean {
    return this.selectedClientIds.has(clientId);
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.clients.forEach(c => {
        if (c.id) this.selectedClientIds.add(c.id);
      });
    } else {
      this.selectedClientIds.clear();
    }
  }

  areAllSelected(): boolean {
    if (this.clients.length === 0) return false;
    return this.clients.every(c => c.id && this.selectedClientIds.has(c.id));
  }

  deleteSelected() {
    const idsToDelete = Array.from(this.selectedClientIds);
    if (idsToDelete.length === 0) return;

    if (confirm(`Deseja realmente excluir os ${idsToDelete.length} clientes selecionados?`)) {
      this.clientService.deleteMultiple(idsToDelete).subscribe({
        next: () => {
          this.selectedClientIds.clear();
          this.loadClients();
        },
        error: (err) => {
          this.errorMessage = 'Erro ao excluir alguns clientes.';
          console.error(err);
          this.loadClients();
        }
      });
    }
  }
}