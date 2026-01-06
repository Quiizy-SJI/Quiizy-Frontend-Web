import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamStatistics } from './exam-statistics';

describe('ExamStatistics', () => {
  let component: ExamStatistics;
  let fixture: ComponentFixture<ExamStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamStatistics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamStatistics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
