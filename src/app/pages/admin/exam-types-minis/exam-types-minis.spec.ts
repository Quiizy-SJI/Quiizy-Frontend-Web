import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTypesMinis } from './exam-types-minis';

describe('ExamTypesMinis', () => {
  let component: ExamTypesMinis;
  let fixture: ComponentFixture<ExamTypesMinis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamTypesMinis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamTypesMinis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
