import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesChat } from './messages-chat';

describe('MessagesChat', () => {
  let component: MessagesChat;
  let fixture: ComponentFixture<MessagesChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
