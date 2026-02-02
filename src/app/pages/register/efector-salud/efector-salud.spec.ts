import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfectorSalud } from './efector-salud';

describe('EfectorSalud', () => {
  let component: EfectorSalud;
  let fixture: ComponentFixture<EfectorSalud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EfectorSalud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EfectorSalud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
