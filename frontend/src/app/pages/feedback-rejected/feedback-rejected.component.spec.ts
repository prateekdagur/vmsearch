import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackRejectedComponent } from './feedback-rejected.component';

describe('FeedbackRejectedComponent', () => {
  let component: FeedbackRejectedComponent;
  let fixture: ComponentFixture<FeedbackRejectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackRejectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
