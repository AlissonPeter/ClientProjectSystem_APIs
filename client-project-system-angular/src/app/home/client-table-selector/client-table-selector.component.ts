import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Client } from '../../model/Client';

@Component({
  selector: 'app-client-table-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-table-selector.component.html',
  styleUrls: ['./client-table-selector.component.css']
})
export class ClientTableSelectorComponent implements OnInit {
  clients: Client[] = [];
  client: Client = new Client();
  removeIcon = 'assets/Icons/remove.png'; // ajuste se o caminho for diferente

  @Output() clientSelected = new EventEmitter<any>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getClients();
  }

  async getClients() {
    try {
      const response: any = await firstValueFrom(this.http.get('http://localhost:8081/clients/all'));
      this.clients = response;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  }

  setClient(clientId: string, clientName: string) {
    this.client.id = clientId;
    this.client.name = clientName;
    console.log('client', this.client);
    this.clientSelected.emit(this.client);
  }

  async deleteClientsSelected() {
    try {
      const table = document.getElementById('tableClients')!;
      const checkboxes = table.querySelectorAll<HTMLInputElement>('.checkboxRemove:checked');
      const ids = Array.from(checkboxes).map(cb => cb.closest('tr')!.cells[0].textContent!);

      for (const id of ids) {
        await firstValueFrom(this.http.delete(`http://localhost:8081/clients/${id}`));
        console.log(`Client ${id} removed`);
      }

      this.getClients();
    } catch (error) {
      console.error('Erro ao deletar clientes:', error);
    }
  }
}
