import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAssistance } from './card-assistance';

describe('CardAssistance', () => {
  let component: CardAssistance;
  let fixture: ComponentFixture<CardAssistance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAssistance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAssistance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
