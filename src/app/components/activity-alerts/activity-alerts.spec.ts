import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityAlerts } from './activity-alerts';

describe('ActivityAlerts', () => {
  let component: ActivityAlerts;
  let fixture: ComponentFixture<ActivityAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityAlerts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityAlerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
