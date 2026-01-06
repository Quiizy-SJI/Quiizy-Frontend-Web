import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsCatalog } from './departments-catalog';

describe('DepartmentsCatalog', () => {
  let component: DepartmentsCatalog;
  let fixture: ComponentFixture<DepartmentsCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentsCatalog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentsCatalog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
