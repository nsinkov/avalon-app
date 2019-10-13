import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { map } from 'rxjs/operators';
import { isAdmin } from '../dummy-auth/dummy-auth';
import { BroadcastService } from '../services/broadcast.service';
import { AvatarService } from '../services/avatar.service';
class Game {
    constructor(public name) { }
}
class Player {
    constructor(public name) { }
}

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  isAdmin = isAdmin;

  // public games: AngularFireList<Game[]>;
  // public gamesVals;
  public players;//: AngularFireList<Player[]>;
  public playersVals;
  picksMap = {};
  constructor(
    private db: AngularFireDatabase,
    private broadcastService: BroadcastService,
    private avatarService: AvatarService
    ) 
{
    // this.games = db.list('/games');
    // this.gamesVals = this.games.valueChanges();

    
    if(localStorage.getItem('uuid') === null || localStorage.getItem('uuid') == undefined) {
      localStorage.setItem('uuid', '_' + Math.floor(Math.random() * (999999999)));
    }
    const sortPlayers = (a,b) => {
      const at = (this.picksMap[a.name] || 't0')
      const bt = (this.picksMap[b.name] || 't0')
      if (bt < at) return -1
      if (bt > at) return 1
      return a.lcname < b.lcname ? -1 : 1
    }
    this.uuid = localStorage.getItem('uuid');
    this.db.list('/picks/' + this.uuid).snapshotChanges()    
    .subscribe(picks => 
      {
        // if '/picks/' + this.uuid is missing, will get back zero-length picks list
        picks.forEach(pick => this.picksMap[pick.key] =  pick.payload.val())

          this.players = db.list('/players');
          this.playersVals = this.players.snapshotChanges().pipe(
            map(actions => actions.map(
              c => ({ key: c.payload.key, lcname: c.payload.val().name.toLowerCase(), ...c.payload.val() })
            ).sort(sortPlayers))
          );
        }
    );


   }
  uuid;
  ngOnInit() {
  }
  dev() {

    this.db.list('/players', ref => ref.orderByChild('name')
      .equalTo('Bulbasaur'))
      .snapshotChanges().pipe(
      map(actions => actions.map(
        c => ({ key: c.payload.key, val: c.payload.val() })      
      ))
    ).subscribe(x =>
      x.forEach(y => {
        console.log(y.val);
        this.players.remove(y.key);
      })
      );
  }
  addPlayer() {
    this.players.push({name:"hmm"});
  }
  printPlayer(player){
    console.log(player.key);
  }
  deletePlayer(player){
    this.players.remove(player.key);
  }
   getAvatar(name) {
     return this.avatarService.getAvatar(name);
  }

  clearSelectedPlayer() {
    localStorage.removeItem('selected_player');
    this.broadcastService.getSelectedPlayer().next(null);
  }
  selectPlayer(player) {
    localStorage.setItem('selected_player', player.name);
    this.db.object('/picks/' + this.uuid + '/' + player.name).set('t' + Date.now());
    this.broadcastService.getSelectedPlayer().next(player.name);
    this.db.object('/picks/lastUpdateTime/' + this.uuid).set('' + Date.now());
  }

  clearSorting() {
    this.db.object('/picks/' + this.uuid ).remove()
  }
}