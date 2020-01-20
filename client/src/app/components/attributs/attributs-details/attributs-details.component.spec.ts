import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownListComponent } from 'src/app/shared/custom-dropdown-list/custom-dropdown-list.component';
import { BrushControlsComponent } from '../controls/brush-controls/brush-controls.component';
import { CircleControlsComponent } from '../controls/circle-controls/circle-controls.component';
import { FeatherControlsComponent } from '../controls/feather-controls/feather-controls.component';
import { PenControlsComponent } from '../controls/pen-controls/pen-controls.component';
import { PencilControlsComponent } from '../controls/pencil-controls/pencil-controls.component';
import { RectangleControlsComponent } from '../controls/rectangle-controls/rectangle-controls.component';
import { SelectControlsComponent } from '../controls/select-controls/select-controls.component';
import { AttributsDetailsComponent } from './attributs-details.component';

import { MatFormFieldModule, MatSelectModule, MatSlideToggleModule } from '@angular/material';

import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { EraseControlsComponent } from '../controls/erase-controls/erase-controls/erase-controls.component';

describe('AttributsDetailsComponent', () => {
  let component: AttributsDetailsComponent;
  let fixture: ComponentFixture<AttributsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AttributsDetailsComponent,
        SelectControlsComponent,
        RectangleControlsComponent,
        CircleControlsComponent,
        PenControlsComponent,
        PencilControlsComponent,
        FeatherControlsComponent,
        BrushControlsComponent,
        InputNumberComponent,
        DropdownListComponent,
        EraseControlsComponent,
      ],
      imports: [
        FormsModule,
        MatIconModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSlideToggleModule,
      ],
      providers: [AbstractSubscriptions],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [
            SelectControlsComponent,
            RectangleControlsComponent,
            CircleControlsComponent,
            PenControlsComponent,
            PencilControlsComponent,
            FeatherControlsComponent,
            BrushControlsComponent,
            EraseControlsComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
