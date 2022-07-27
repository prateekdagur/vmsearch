import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontdeskMyaccountComponent } from './frontdesk-myaccount.component';

describe('FrontdeskMyaccountComponent', () => {
  let component: FrontdeskMyaccountComponent;
  let fixture: ComponentFixture<FrontdeskMyaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrontdeskMyaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontdeskMyaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
