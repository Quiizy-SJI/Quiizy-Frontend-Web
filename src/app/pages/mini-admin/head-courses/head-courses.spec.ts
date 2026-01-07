import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadCourses } from './head-courses';

describe('HeadCourses', () => {
  let component: HeadCourses;
  let fixture: ComponentFixture<HeadCourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadCourses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadCourses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
