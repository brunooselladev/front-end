import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedHelp } from './need-help';

describe('NeedHelp', () => {
  let component: NeedHelp;
  let fixture: ComponentFixture<NeedHelp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeedHelp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeedHelp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
