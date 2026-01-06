import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicOverview } from './academic-overview';

describe('AcademicOverview', () => {
  let component: AcademicOverview;
  let fixture: ComponentFixture<AcademicOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
