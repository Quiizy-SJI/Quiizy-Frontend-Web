import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingUnitsTable } from './teaching-units-table';

describe('TeachingUnitsTable', () => {
  let component: TeachingUnitsTable;
  let fixture: ComponentFixture<TeachingUnitsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachingUnitsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachingUnitsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
