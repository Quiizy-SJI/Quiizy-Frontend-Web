import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadDashboard } from './head-dashboard';

describe('HeadDashboard', () => {
  let component: HeadDashboard;
  let fixture: ComponentFixture<HeadDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
