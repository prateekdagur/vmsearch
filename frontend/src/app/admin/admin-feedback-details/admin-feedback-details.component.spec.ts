import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFeedbackDetailsComponent } from './admin-feedback-details.component';

describe('AdminFeedbackDetailsComponent', () => {
  let component: AdminFeedbackDetailsComponent;
  let fixture: ComponentFixture<AdminFeedbackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFeedbackDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFeedbackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
