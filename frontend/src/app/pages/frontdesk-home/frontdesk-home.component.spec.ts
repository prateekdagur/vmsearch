import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontdeskHomeComponent } from './frontdesk-home.component';

describe('FrontdeskHomeComponent', () => {
  let component: FrontdeskHomeComponent;
  let fixture: ComponentFixture<FrontdeskHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrontdeskHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontdeskHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
