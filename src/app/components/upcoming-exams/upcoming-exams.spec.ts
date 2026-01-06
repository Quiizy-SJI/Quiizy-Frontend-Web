import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingExams } from './upcoming-exams';

describe('UpcomingExams', () => {
  let component: UpcomingExams;
  let fixture: ComponentFixture<UpcomingExams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingExams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingExams);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
