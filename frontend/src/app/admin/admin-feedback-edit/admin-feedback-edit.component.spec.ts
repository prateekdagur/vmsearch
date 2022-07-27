import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFeedbackEditComponent } from './admin-feedback-edit.component';

describe('AdminFeedbackEditComponent', () => {
  let component: AdminFeedbackEditComponent;
  let fixture: ComponentFixture<AdminFeedbackEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFeedbackEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFeedbackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
