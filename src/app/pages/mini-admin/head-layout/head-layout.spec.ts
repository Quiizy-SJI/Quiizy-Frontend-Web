import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadLayout } from './head-layout';

describe('HeadLayout', () => {
  let component: HeadLayout;
  let fixture: ComponentFixture<HeadLayout>;  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
