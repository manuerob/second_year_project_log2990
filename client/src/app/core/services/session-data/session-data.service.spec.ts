import { TestBed } from '@angular/core/testing';

import { User } from '../../models/user';
import { SessionDataService } from './session-data.service';

describe('SessionDataService', () => {
  let sessionData: SessionDataService;
  const newUser: User = { showWelcomePage: false };

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [],
    }),
  );
  beforeEach(() => (sessionData = TestBed.get(SessionDataService)));

  it('should be created', () => {
    expect(sessionData).toBeTruthy();
  });

  it('should return true for default value of user', (done: DoneFn) => {
    sessionData.activeUser$.subscribe((user) => {
      expect(user.showWelcomePage).toBeTruthy();
      done();
    });
  });

  it('should return true for the default value of the user', () => {
    const user: User = sessionData.activeUser;
    expect(user.showWelcomePage).toBeTruthy();
  });

  it('should return false for the new user', () => {
    sessionData.activeUser = newUser;
    expect(sessionData.activeUser.showWelcomePage).not.toBeTruthy();
  });
});
