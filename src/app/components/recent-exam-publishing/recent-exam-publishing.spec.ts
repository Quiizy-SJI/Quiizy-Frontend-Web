import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentExamPublishing } from './recent-exam-publishing';

describe('RecentExamPublishing', () => {
  let component: RecentExamPublishing;
  let fixture: ComponentFixture<RecentExamPublishing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentExamPublishing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentExamPublishing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
