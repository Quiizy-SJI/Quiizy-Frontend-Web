import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightDistribution } from './weight-distribution';

describe('WeightDistribution', () => {
  let component: WeightDistribution;
  let fixture: ComponentFixture<WeightDistribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightDistribution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightDistribution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
