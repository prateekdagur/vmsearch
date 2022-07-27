import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskManagerComponent } from './front-desk-manager.component';

describe('FrontDeskManagerComponent', () => {
  let component: FrontDeskManagerComponent;
  let fixture: ComponentFixture<FrontDeskManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrontDeskManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
