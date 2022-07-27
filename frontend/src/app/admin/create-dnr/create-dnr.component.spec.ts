import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDnrComponent } from './create-dnr.component';

describe('CreateDnrComponent', () => {
  let component: CreateDnrComponent;
  let fixture: ComponentFixture<CreateDnrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDnrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDnrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
