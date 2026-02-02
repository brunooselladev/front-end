import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedHelpUsmya } from './need-help-usmya';

describe('NeedHelpUsmya', () => {
  let component: NeedHelpUsmya;
  let fixture: ComponentFixture<NeedHelpUsmya>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeedHelpUsmya]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeedHelpUsmya);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
