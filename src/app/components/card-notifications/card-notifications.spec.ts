import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardNotifications } from './card-notifications';

describe('CardNotifications', () => {
  let component: CardNotifications;
  let fixture: ComponentFixture<CardNotifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardNotifications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardNotifications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
