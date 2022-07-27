import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskLoginComponent } from './front-desk-login.component';

describe('FrontDeskLoginComponent', () => {
  let component: FrontDeskLoginComponent;
  let fixture: ComponentFixture<FrontDeskLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrontDeskLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
