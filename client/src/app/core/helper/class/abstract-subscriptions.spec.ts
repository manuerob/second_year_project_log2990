import { TestBed } from '@angular/core/testing';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';

describe('AbstractSubscriptions', () => {
  let service: AbstractSubscriptions;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [AbstractSubscriptions],
    }),
  );

  beforeEach(() => {
    service = TestBed.get(AbstractSubscriptions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
