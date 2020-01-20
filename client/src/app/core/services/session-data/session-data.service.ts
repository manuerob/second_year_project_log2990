import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class SessionDataService {
  private readonly activeUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>({
    showWelcomePage: true,
  });

  readonly activeUser$: Observable<User> = this.activeUserSubject.asObservable();

  get activeUser(): User {
    return this.activeUserSubject.getValue();
  }

  set activeUser(user: User) {
    this.activeUserSubject.next(user);
  }
}
