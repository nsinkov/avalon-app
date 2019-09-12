import { Component, OnInit } from '@angular/core';

import { BroadcastService } from '../services/broadcast.service';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  selectedPlayer = null;
  constructor(broadcastService: BroadcastService ) { 
    this.selectedPlayer = localStorage.getItem('selected_player');
    broadcastService.getSelectedPlayer().asObservable()
    .subscribe(x => this.selectedPlayer = x);
  }
  ngOnInit() {
    //this.selectedPlayer = localStorage.getItem('selected_player');
  }

}
