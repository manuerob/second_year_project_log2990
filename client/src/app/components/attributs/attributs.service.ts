import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Attributs } from './../../core/models/attributs';

@Injectable({
  providedIn: 'root',
})
export class AttributsService {
  textures: Map<string, string>;
  plotTypes: Map<string, string>;
  linePatterns: Map<string, string>;
  junctionTypes: Map<string, string>;
  stampChoices: Map<number, string>;
  alignmentTypes: Map<string, string>;
  mutators: Map<string, string>;
  fonts: Map<string, string>;
  snappingPointChoices: Map<string, string>;
  attributsSubject: BehaviorSubject<Attributs>;
  attributs$: Observable<Attributs>;

  constructor() {
    this.textures = new Map([
      ['air_spray', 'Vaporisateur'],
      ['ink_bleed', 'Trace d\'encre'],
      ['smear', 'Floue'],
      ['leaves', 'Feuille'],
      ['cool', 'Glace'],
    ]);
    this.plotTypes = new Map([
      ['Full', 'Plein avec périmetre'],
      ['Outline', 'Périmetre seulement'],
      ['FullWithoutOutline', 'Plein sans périmetre'],
    ]);
    this.linePatterns = new Map([
      ['continue', 'Continue'],
      ['dot_line', 'Pointillés'],
      ['dash_line', 'Tirets'],
    ]);
    this.junctionTypes = new Map([
      ['normal', 'Angle'],
      ['round', 'Arrondi'],
      ['circle', 'Point'],
    ]);
    this.stampChoices = new Map([
      [1, 'Licorne dabbeuse'],
      [2, 'Extraterrestre'],
      [3, 'Repas spécial'],
      // tslint:disable: no-magic-numbers
      [4, 'Chien mignon'],
      [5, 'Pow'],
    ]);
    this.alignmentTypes = new Map([
      ['start', 'Gauche'],
      ['middle', 'Centre'],
      ['end', 'Droite'],
    ]);

    this.mutators = new Map([
      ['normal', 'Normal'],
      ['bold', 'Gras'],
      ['italic', 'Italique'],
    ]);

    this.fonts = new Map([
      ['arial', 'Arial'],
      ['roboto', 'Roboto'],
      ['times', 'Times'],
      ['courier', 'Courier'],
      ['verdana', 'Verdana'],
    ]);

    this.snappingPointChoices = new Map([
      ['left-top', 'Gauche-Dessus'],
      ['center-top', 'Centre-Dessus'],
      ['right-top', 'Droite-Dessus'],
      ['left-middle', 'Gauche-Milieu'],
      ['center-middle', 'Centre-Milieu'],
      ['right-middle', 'Droite-Milieu'],
      ['left-bottom', 'Gauche-Bas'],
      ['center-bottom', 'Centre-Bas'],
      ['right-bottom', 'Droite-Bas'],
    ]);

    this.attributsSubject = new BehaviorSubject<Attributs>({
      width: 12,
      plotType: 'Full',
      angle: 0,
      numberOfSize: 1,
      junctionType: 'normal',
      linePattern: 'continue',
      pointJointDiameter: 8,
      texture: 'air_spray',
      scaleFactor: 20,
      stampChoice: -1,
      sideCount: 5,
      lineJoint: 'round',
      alignmentType: 'start',
      mutator: 'bold',
      font: 'arial',
      fontSize: 12,
      minWidth: 1,
      eraseSize: 10,
      emissionRate: 100,
      featherLength: 10,
      snappingPoint: 'center-middle',
      tolerance: 15,
      featherWidth: 1,
    });

    this.attributs$ = this.attributsSubject.asObservable();
  }

  get attributs(): Attributs {
    return this.attributsSubject.value;
  }

  set attributs(newAttributs: Attributs) {
    this.attributsSubject.next(newAttributs);
  }

  changeAngle(newAngle: number): void {
    this.attributsSubject.next({ ...this.attributs, angle: newAngle });
  }

  changeFontSize(newFontSize: number): void {
    this.attributsSubject.next({ ...this.attributs, fontSize: newFontSize });
  }

  changeFont(newFont: string): void {
    this.attributsSubject.next({ ...this.attributs, font: newFont });
  }
  changeAlignType(newAlignType: string): void {
    this.attributsSubject.next({
      ...this.attributs,
      alignmentType: newAlignType,
    });
  }
  changeMutator(newMutator: string): void {
    this.attributsSubject.next({ ...this.attributs, mutator: newMutator });
  }

  changeMinWidth(newMinWidth: number): void {
    this.attributsSubject.next({ ...this.attributs, minWidth: newMinWidth });
  }

  changeWidth(newWidth: number): void {
    this.attributsSubject.next({ ...this.attributs, width: newWidth });
  }
  changeSideCount(newSideCount: number): void {
    this.attributsSubject.next({ ...this.attributs, sideCount: newSideCount });
  }

  changeTolerance(newTolerance: number): void {
    this.attributsSubject.next({ ...this.attributs, tolerance: newTolerance });
  }

  changeSnappingPoint(newSnappingPoint: string): void {
    this.attributsSubject.next({
      ...this.attributs,
      snappingPoint: newSnappingPoint,
    });
  }
}
