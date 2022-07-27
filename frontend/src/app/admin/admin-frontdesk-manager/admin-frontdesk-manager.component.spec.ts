import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFrontdeskManagerComponent } from './admin-frontdesk-manager.component';

describe('AdminFrontdeskManagerComponent', () => {
  let component: AdminFrontdeskManagerComponent;
  let fixture: ComponentFixture<AdminFrontdeskManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFrontdeskManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFrontdeskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
