import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Kind } from '../status-form/status-kind';
import { Status } from '../../model/Status';

@Component({
  selector: 'app-status-table-selector',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './status-table-selector.component.html',
  styleUrl: './status-table-selector.component.css'
})
export class StatusTableSelectorComponent implements OnInit {

  kinds = Kind.getOptions();
  removeIcon = 'assets/Icons/remove.png';
  statusList: Status[] = [];
  status: Status = new Status();

  @Output() statusSelected = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  this.getStatus();
}

getKindDescription(kindId: number) {
return Kind.getDescription(kindId); // Converte o ID para a descrição correspondente
}
async getStatus() {
  try {
    const response : any = await firstValueFrom(this.http.get('http://localhost:8081/status/all'));
    this.statusList = response;
  } catch (error) {
    console.log(error);
    console.error('Error fetching projects:', error);
  }
}

clearForm() {
  this.status = new Status();
}

setStatus(id: string, description: string, kind: number) {
  this.status.id = id;
  this.status.description = description;
  this.status.kind = kind;
  this.statusSelected.emit(this.status);
  console.log('status', this.status);
}

async deleteStatusSelected() {
  try {
     const table = document.getElementById('tableStatus')!;
      const checkboxes = table.querySelectorAll<HTMLInputElement>('.checkboxRemove:checked');
      const ids = Array.from(checkboxes).map(cb => cb.closest('tr')!.cells[0].textContent!);
    for (const id of ids) {
      await firstValueFrom(this.http.delete(`http://localhost:8081/status/${id.trim()}`));
      console.log(`Status ${id} removed`);
    }
    this.getStatus();
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
}

}
