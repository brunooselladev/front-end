import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathPatient } from './path-patient';

describe('PathPatient', () => {
  let component: PathPatient;
  let fixture: ComponentFixture<PathPatient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathPatient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathPatient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
