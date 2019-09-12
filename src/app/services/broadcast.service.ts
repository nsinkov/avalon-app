import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
@Injectable()
export class BroadcastService {

    private selectedPlayer = new Subject<string>();
  constructor() { }

  getSelectedPlayer() {
    return this.selectedPlayer;
  }
}