import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { INSTRUCTIONS } from './instructions';

const STORAGE_KEY = 'checkboxStatus';

@Component({
  selector: 'app-welcome-window',
  templateUrl: './welcome-window.component.html',
  styleUrls: ['./welcome-window.component.scss'],
})
export class WelcomeWindowComponent {
  isChecked: boolean;
  welcomeMessage: HTMLElement;
  tutorial: HTMLElement;
  instructions: object[];
  nextIndex: number;

  constructor(
    public dialogRef: MatDialogRef<WelcomeWindowComponent>, ) {
    this.nextIndex = 0;
    this.instructions = INSTRUCTIONS;
    this.isChecked = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKeydownHandler(): void {
    this.onClose();
  }

  onClose(): void {
    this.dialogRef.close();
    this.storeOnSessionStorage();
  }

  storeOnSessionStorage(): void {
    sessionStorage.setItem(STORAGE_KEY, this.isChecked.toString());
  }

  showTutorial(): void {
    this.welcomeMessage = document.getElementById(
      'welcome-message',
    ) as HTMLElement;
    this.welcomeMessage.style.display = 'none';

    this.tutorial = document.getElementById('tutorial') as HTMLElement;
    this.tutorial.style.display = 'block';
  }

  goBack(stepper: MatStepper): void {
    stepper.previous();
    this.nextIndex--;
  }

  goForward(stepper: MatStepper, element: SVGGraphicsElement): void {
    stepper.next();
    this.nextIndex++;
  }

}
