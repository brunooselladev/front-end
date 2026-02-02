import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardParticipant } from './card-participant';

describe('CardParticipant', () => {
  let component: CardParticipant;
  let fixture: ComponentFixture<CardParticipant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardParticipant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardParticipant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
