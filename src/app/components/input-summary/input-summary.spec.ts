import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSummary } from './input-summary';

describe('InputSummary', () => {
  let component: InputSummary;
  let fixture: ComponentFixture<InputSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
