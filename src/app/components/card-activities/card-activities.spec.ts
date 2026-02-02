import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardActivitiesComponent } from './card-activities';

describe('CardActivitiesComponent', () => {
  let component: CardActivitiesComponent;
  let fixture: ComponentFixture<CardActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
