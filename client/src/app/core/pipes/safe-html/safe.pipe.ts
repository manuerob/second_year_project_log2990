import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) { }

  // tslint:disable-next-line: no-any
  transform(value: any, type?: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
