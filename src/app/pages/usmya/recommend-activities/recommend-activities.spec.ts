import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendActivitiesComponent } from './recommend-activities';

describe('RecommendActivitiesComponent', () => {
  let component: RecommendActivitiesComponent;
  let fixture: ComponentFixture<RecommendActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
