import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTypesTable } from './exam-types-table';

describe('ExamTypesTable', () => {
  let component: ExamTypesTable;
  let fixture: ComponentFixture<ExamTypesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamTypesTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamTypesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
