import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSummary } from './form-summary';

describe('FormSummary', () => {
  let component: FormSummary;
  let fixture: ComponentFixture<FormSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
