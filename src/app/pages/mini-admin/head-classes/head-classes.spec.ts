import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadClasses } from './head-classes';

describe('HeadClasses', () => {
  let component: HeadClasses;
  let fixture: ComponentFixture<HeadClasses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadClasses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadClasses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
