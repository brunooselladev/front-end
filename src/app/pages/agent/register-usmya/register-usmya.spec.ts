import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUsmya } from './register-usmya';

describe('RegisterUsmya', () => {
  let component: RegisterUsmya;
  let fixture: ComponentFixture<RegisterUsmya>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterUsmya]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterUsmya);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
