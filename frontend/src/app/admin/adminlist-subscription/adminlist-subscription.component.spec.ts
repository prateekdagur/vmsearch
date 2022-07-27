import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminlistSubscriptionComponent } from './adminlist-subscription.component';

describe('AdminlistSubscriptionComponent', () => {
  let component: AdminlistSubscriptionComponent;
  let fixture: ComponentFixture<AdminlistSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminlistSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminlistSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
