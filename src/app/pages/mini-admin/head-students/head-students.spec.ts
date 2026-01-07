import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadStudents } from './head-students';

describe('HeadStudents', () => {
  let component: HeadStudents;
  let fixture: ComponentFixture<HeadStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadStudents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadStudents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
