import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationPipeline } from './evaluation-pipeline';

describe('EvaluationPipeline', () => {
  let component: EvaluationPipeline;
  let fixture: ComponentFixture<EvaluationPipeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationPipeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationPipeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
