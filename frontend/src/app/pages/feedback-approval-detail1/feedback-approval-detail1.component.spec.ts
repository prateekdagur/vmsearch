import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackApprovalDetail1Component } from './feedback-approval-detail1.component';

describe('FeedbackApprovalDetail1Component', () => {
  let component: FeedbackApprovalDetail1Component;
  let fixture: ComponentFixture<FeedbackApprovalDetail1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackApprovalDetail1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackApprovalDetail1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
