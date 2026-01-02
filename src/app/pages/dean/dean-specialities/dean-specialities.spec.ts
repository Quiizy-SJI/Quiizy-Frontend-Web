import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeanSpecialities } from './dean-specialities';

describe('DeanSpecialities', () => {
  let component: DeanSpecialities;
  let fixture: ComponentFixture<DeanSpecialities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeanSpecialities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeanSpecialities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
