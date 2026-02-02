import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsActivities } from './notifications-activities';

describe('NotificationsActivities', () => {
  let component: NotificationsActivities;
  let fixture: ComponentFixture<NotificationsActivities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsActivities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsActivities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
