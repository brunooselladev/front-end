import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSpace } from './profile-space';

describe('ProfileSpace', () => {
  let component: ProfileSpace;
  let fixture: ComponentFixture<ProfileSpace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSpace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSpace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
