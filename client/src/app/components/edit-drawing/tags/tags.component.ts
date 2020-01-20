import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from './../../../core/services/api/api.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  visible: boolean;
  selectable: boolean;
  removable: boolean;
  addOnBlur: boolean;
  separatorKeysCodes: number[];
  tagsCtrl: FormControl = new FormControl();
  filteredTags: Observable<string[]>;
  selectedTags: string[];
  tags: string[];
  @Output() changeSelectedTags: EventEmitter<string[]>;

  @ViewChild('tagsInput', { static: false }) tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(private api: ApiService) {
    this.visible = true;
    this.selectable = true;
    this.removable = true;
    this.addOnBlur = true;
    this.separatorKeysCodes = [ENTER, COMMA];
    this.selectedTags = [];
    this.changeSelectedTags = new EventEmitter();
  }

  ngOnInit(): void {
    this.api.tags$.subscribe((tags: string[]) => {
      this.tags = tags;
      this.reloadTags();
    });
  }

  reloadTags(): void {
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag
          ? this._filter(tag)
          : this.tags.filter((filterTag: string) => {
            return !this.selectedTags.includes(filterTag);
          }),
      ),
    );
  }

  add({ value, input }: MatChipInputEvent): void {
    if ((value || '').trim()) {
      this.selectedTags.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.tagsCtrl.setValue(null);
    this.changeSelectedTags.emit(this.selectedTags);
  }

  remove(tag: string): void {
    const index: number = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
    this.changeSelectedTags.emit(this.selectedTags);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTags.push(event.option.value);
    this.changeSelectedTags.emit(this.selectedTags);
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue: string = value.toLowerCase();

    return this.tags.filter((tag: string) => {
      return !this.selectedTags.includes(tag) && tag.toLowerCase().indexOf(filterValue) === 0;
    });
  }

  isTagOnServer = (tag: string): boolean => {
    const foundTag = this.tags.find(
      (currentTag: string) => currentTag === tag,
    );
    return foundTag !== undefined;
  }
}
