import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTableSelectorComponent } from './client-table-selector.component';

describe('ClientTableSelectorComponent', () => {
  let component: ClientTableSelectorComponent;
  let fixture: ComponentFixture<ClientTableSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientTableSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientTableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
