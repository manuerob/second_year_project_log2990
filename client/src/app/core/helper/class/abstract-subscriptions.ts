import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class AbstractSubscriptions implements OnDestroy {
  subscriptions: Subscription[];

  constructor() {
    this.subscriptions = [];
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
