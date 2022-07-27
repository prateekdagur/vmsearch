import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnrListComponent } from './dnr-list.component';

describe('DnrListComponent', () => {
  let component: DnrListComponent;
  let fixture: ComponentFixture<DnrListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnrListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
