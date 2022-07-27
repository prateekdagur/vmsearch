import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDnrComponent } from './admin-dnr.component';

describe('AdminDnrComponent', () => {
  let component: AdminDnrComponent;
  let fixture: ComponentFixture<AdminDnrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDnrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDnrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
