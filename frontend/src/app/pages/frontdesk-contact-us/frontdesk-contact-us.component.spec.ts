import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontdeskContactUsComponent } from './frontdesk-contact-us.component';

describe('FrontdeskContactUsComponent', () => {
  let component: FrontdeskContactUsComponent;
  let fixture: ComponentFixture<FrontdeskContactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrontdeskContactUsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontdeskContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
