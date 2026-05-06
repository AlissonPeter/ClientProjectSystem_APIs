import { Component, Input, Output, EventEmitter, signal, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StatusTableSelectorComponent } from '../../status-table-selector/status-table-selector.component';
import { Activity } from '../../../model/Activity';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusTableSelectorComponent],
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.css'
})
export class ActivityFormComponent {
  @Input() activities: any[] = [];
  @Output() activitiesChange = new EventEmitter<any[]>();

  API_BACKEND_URL: string = 'http://localhost:8081/';

  @ViewChild(StatusTableSelectorComponent) tableStatus!: StatusTableSelectorComponent;

  searchIcon = 'assets/Icons/search.png';
  removeIcon = 'assets/Icons/remove.png';
  showTableStatus = false;

  localActivities = signal<any[]>([]);
  activitiesChecked = signal<number[]>([]);
  submitted = false;
  response: string | null = null;
  activityIndex: number | null = null;

  activity: Activity = new Activity();

  constructor(private http: HttpClient) {
    effect(() => {
      this.localActivities.set([...this.activities]);
    });
  }

  toggleTableStatus(): void {
    this.showTableStatus = true;
  }

  handleStatusSelected(status: any): void {
    this.activity.status = { ...status };
    this.showTableStatus = false;
  }

  blockSigns(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }

  clearForm(): void {
    this.activity = new Activity();
    this.activityIndex = null;
  }

  backProject(): void {
    this.activitiesChange.emit(this.localActivities());
  }

  setActivity(activity: any, index: number): void {
    this.activityIndex = index;
    this.activity = { ...activity, status: { ...activity.status } };
  }

  toggleSelection(event: Event, index: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = this.activitiesChecked();
    this.activitiesChecked.set(
      checked
        ? [...current, index]
        : current.filter(i => i !== index)
    );
  }

  loadStatus(): void {
    if (!this.activity.status.id) return;

    this.http.get<any>(`${this.API_BACKEND_URL}status/${this.activity.status.id}`).subscribe({
      next: (data) => this.handleStatusSelected(data),
      error: (err) => {
        console.error('Erro ao buscar o status:', err);
        this.response = 'Erro ao buscar o status';
      }
    });
  }

  submitForm(): void {
    this.submitted = true;

    const current = this.localActivities();
    if (this.activityIndex === null) {
      this.localActivities.set([...current, { ...this.activity }]);
    } else {
      current[this.activityIndex] = { ...this.activity };
      this.localActivities.set([...current]);
    }

    this.clearForm();
  }

  deleteActivitiesSelected(): void {
    const selected = this.activitiesChecked();
    const updated = this.localActivities().filter((_, i) => !selected.includes(i));
    this.localActivities.set(updated);
    this.activitiesChecked.set([]);
  }
}
