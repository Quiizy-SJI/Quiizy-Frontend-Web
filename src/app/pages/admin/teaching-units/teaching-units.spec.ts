import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingUnits } from './teaching-units';

describe('TeachingUnits', () => {
  let component: TeachingUnits;
  let fixture: ComponentFixture<TeachingUnits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachingUnits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachingUnits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
