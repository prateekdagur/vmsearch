import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackApprovalComponent } from './feedback-approval.component';

describe('FeedbackApprovalComponent', () => {
  let component: FeedbackApprovalComponent;
  let fixture: ComponentFixture<FeedbackApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
