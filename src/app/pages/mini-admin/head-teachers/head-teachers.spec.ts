import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadTeachers } from './head-teachers';

describe('HeadTeachers', () => {
  let component: HeadTeachers;
  let fixture: ComponentFixture<HeadTeachers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadTeachers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadTeachers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
