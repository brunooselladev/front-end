import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectiveReferent } from './affective-referent';

describe('AffectiveReferent', () => {
  let component: AffectiveReferent;
  let fixture: ComponentFixture<AffectiveReferent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffectiveReferent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffectiveReferent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
