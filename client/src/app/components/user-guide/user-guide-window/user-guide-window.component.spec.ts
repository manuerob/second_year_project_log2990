import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGuideWindowComponent } from './user-guide-window.component';

import { MatDialogModule, MatDialogRef } from '@angular/material';
describe('UserGuideWindowComponent', () => {
  let component: UserGuideWindowComponent;
  let fixture: ComponentFixture<UserGuideWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserGuideWindowComponent],
      imports: [MatDialogModule],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuideWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
