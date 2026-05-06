import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTableSelectorComponent } from './status-table-selector.component';

describe('StatusTableSelectorComponent', () => {
  let component: StatusTableSelectorComponent;
  let fixture: ComponentFixture<StatusTableSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusTableSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusTableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
