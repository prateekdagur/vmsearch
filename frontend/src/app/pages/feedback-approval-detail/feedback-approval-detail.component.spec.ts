import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackApprovalDetailComponent } from './feedback-approval-detail.component';

describe('FeedbackApprovalDetailComponent', () => {
  let component: FeedbackApprovalDetailComponent;
  let fixture: ComponentFixture<FeedbackApprovalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackApprovalDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackApprovalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
