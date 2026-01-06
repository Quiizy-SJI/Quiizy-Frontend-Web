import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentDetail } from './department-detail';

describe('DepartmentDetail', () => {
  let component: DepartmentDetail;
  let fixture: ComponentFixture<DepartmentDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
