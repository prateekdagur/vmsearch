import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFrontDeskManagerComponent } from './add-front-desk-manager.component';

describe('AddFrontDeskManagerComponent', () => {
  let component: AddFrontDeskManagerComponent;
  let fixture: ComponentFixture<AddFrontDeskManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFrontDeskManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFrontDeskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
