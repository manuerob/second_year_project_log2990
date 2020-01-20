import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatStepperModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorageServiceModule } from 'angular-webstorage-service';
import { WelcomeWindowComponent } from './welcome-window.component';

describe('WelcomeWindowComponent', () => {
  let component: WelcomeWindowComponent;
  let fixture: ComponentFixture<WelcomeWindowComponent>;

  let dialogSpy: jasmine.Spy;

  const dialogMock = {
    close: () => {
      return;
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeWindowComponent],
      imports: [
        StorageServiceModule,
        MatDialogModule,
        MatGridListModule,
        MatStepperModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeWindowComponent);
    component = fixture.componentInstance;

    dialogSpy = spyOn(component.dialogRef, 'close').and.callFake(dialogMock.close);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close welcome modal', () => {
    const spy = spyOn(component, 'storeOnSessionStorage');
    component.onClose();
    expect(dialogSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should show Tutorial', () => {
    component.showTutorial();
    expect(component.welcomeMessage.style.display).toBe('none');
    expect(component.tutorial.style.display).toBe('block');
  });

});
