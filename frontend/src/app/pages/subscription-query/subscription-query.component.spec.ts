import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionQueryComponent } from './subscription-query.component';

describe('SubscriptionQueryComponent', () => {
  let component: SubscriptionQueryComponent;
  let fixture: ComponentFixture<SubscriptionQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
