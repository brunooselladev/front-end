import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompanions } from './my-companions';

describe('MyCompanions', () => {
  let component: MyCompanions;
  let fixture: ComponentFixture<MyCompanions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCompanions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCompanions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
