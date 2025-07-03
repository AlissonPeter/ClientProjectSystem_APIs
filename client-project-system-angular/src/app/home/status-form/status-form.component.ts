import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Kind } from './status-kind';
import { StatusTableSelectorComponent } from '../status-table-selector/status-table-selector.component';
import { Status } from '../../model/Status';

@Component({
  selector: 'app-status-form',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusTableSelectorComponent],
  templateUrl: './status-form.component.html',
  styleUrl: './status-form.component.css'
})
export class StatusFormComponent {

  kinds = Kind.getOptions(); // Inicialize no ngOnInit

  status: Status = new Status();

  submitted = false;
  response: string | null = null;

  @ViewChild(StatusTableSelectorComponent) tableStatus!: StatusTableSelectorComponent;


  constructor(private http: HttpClient) { }

  handleSelected(statusSelected: any) {
    this.status = { ...statusSelected };
  }

  clearForm() {
    this.status = new Status();
  }

  setStatus(status: any) {
    this.status.id = status.id;
    this.status.description = status.description;
    this.status.kind = status.kind;
    console.log('status', this.status);
  }

  async submitForm() {
    try {
      if (!this.status.id) {
        console.log('Create new status');
        const response = await firstValueFrom(this.http.post(`http://localhost:8081/status`, this.status));
      } else {
        console.log('Update status:', this.status.id);
        await firstValueFrom(this.http.put(`http://localhost:8081/status/${this.status.id}?description=${this.status.description}&kind=${this.status.kind}`, {}));
      }

      this.tableStatus.getStatus();
      this.clearForm();
      this.submitted = true;
      this.response = '';

      setTimeout(() => {
        this.submitted = false;
      }, 3000);
    } catch (error) {
      console.error('An error occurred:', error);
      this.response = 'Erro na requisição';
    }
  }
}
