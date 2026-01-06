import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalAlertsTable } from './critical-alerts-table';

describe('CriticalAlertsTable', () => {
  let component: CriticalAlertsTable;
  let fixture: ComponentFixture<CriticalAlertsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriticalAlertsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriticalAlertsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
