import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniAdminsTable } from './mini-admins-table';

describe('MiniAdminsTable', () => {
  let component: MiniAdminsTable;
  let fixture: ComponentFixture<MiniAdminsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniAdminsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniAdminsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
