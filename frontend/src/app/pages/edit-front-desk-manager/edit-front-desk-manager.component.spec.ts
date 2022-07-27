import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFrontDeskManagerComponent } from './edit-front-desk-manager.component';

describe('EditFrontDeskManagerComponent', () => {
  let component: EditFrontDeskManagerComponent;
  let fixture: ComponentFixture<EditFrontDeskManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFrontDeskManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFrontDeskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
