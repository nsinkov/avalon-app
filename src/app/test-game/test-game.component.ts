import { Component, OnInit } from '@angular/core';

import { isAdmin } from '../dummy-auth/dummy-auth';
import { isGarbageOs } from '../os/os-info';
import { AvatarService } from '../services/avatar.service';
import { AngularFireDatabase } from '@angular/fire/database';

import { map, first } from 'rxjs/operators';

@Component({
  selector: 'app-test-game',
  templateUrl: './test-game.component.html',
  styleUrls: ['./test-game.component.css']
})
export class TestGameComponent implements OnInit {

  isAdmin = isAdmin;
  isGarbageOs = isGarbageOs;

  gameRef;
  game;
  gameSynced;
  chaosModeRef;
  chaosMode;
  chaosModeSynced;
  playersRef;
  players;
  selectedPlayer = null;
  constructor(
    private db: AngularFireDatabase,
    private avatarService: AvatarService
  ) {
    this.selectedPlayer = localStorage.getItem('selected_player');
    this.gameRef = db.object('/game');
    this.game = this.gameRef.valueChanges();
    this.game.subscribe(game => this.readNewGameState(game));
    this.chaosModeRef = db.object('/chaosMode');
    this.chaosMode = this.chaosModeRef.valueChanges();
    this.chaosMode.subscribe(m => this.chaosModeSynced = m);
    this.playersRef = db.list('/game/players');
    this.players = this.playersRef.snapshotChanges().pipe(
      map(actions => actions.map(
        c => ({ key: c.payload.key, ...c.payload.val() })      
      ))
    );
  }

  roleDescriptions = {
         blue: "Regular Blue",
         merlin: "Merlin",
         percival: "Percival",
         spy: "Regular Spy",
         assasin: "Assasin",
         morgana: "Morgana",
         mordred: "Mordred",
         worst: "Worst Blue",
  }
  
  readNewGameState(game) {
    this.gameSynced = game;
    if (!game || game.state != 'night-phase' || !game['nightInfo']) return;
      let nightInfo = game['nightInfo'];
      this.allRoles = Object.keys(nightInfo).map((playerName) => {
        return {
          playerName: playerName,
          role: this.roleDescriptions[nightInfo[playerName].role]
        };
      });
    if (!game['nightInfo'][this.selectedPlayer]) return;
      let myNightInfo = game['nightInfo'][this.selectedPlayer];
  
      this.role = this.roleDescriptions[myNightInfo.role];
      this.firstToPropose = myNightInfo.firstToPropose;
      this.firstToProposePlayer = myNightInfo.firstToProposePlayer;
      this.showRoles = game.showRoles;
      this.thumbs = this.showRoles ? myNightInfo.thumbs : myNightInfo.fakeThumbs;
  }

  ngOnInit() {
    // const iAmAnArray = [
    //   { value: "value1", text: "hello" },
    //   { value: "value2", text: "map" }
    // ];

    // const iAmAMap = new Map( // Look Ma!  No type annotations
    //   iAmAnArray.map(x => [x.value, x.text] )
    // );
    // console.log(iAmAMap);
    // console.log(iAmAMap.get("value1"));
  }

  newGame() {
    this.gameRef.set({state: 'new-game'});
  }
  newGameAddAll() {

    this.db.list('/players')
      .snapshotChanges().pipe(
      map(actions => actions.map(
        c => ({ key: c.payload.key, ...c.payload.val() })      
      ))
    ).pipe(first()).subscribe(players =>
     {

      const arrayToObject = (array) =>
        array.reduce((obj, item) => {
          obj[item.key] = item
          return obj
        }, {});
      let playersObj = arrayToObject(players.slice(0,10));
    this.gameRef.set({state: 'new-game', players:playersObj});
     });



  }

  gameIsStarting(game) {
    if (!game) return false;
    //this.gameSynced = game;
    return game.state === 'new-game';
  }

  joinGame() {
    
    this.db.list('/players', ref => ref.orderByChild('name')
      .equalTo(this.selectedPlayer))
      .snapshotChanges().pipe(
      map(actions => actions.map(
        c => ({ key: c.payload.key, val: c.payload.val() })      
      ))
    ).subscribe(
      // x => console.log(x)
      kv => this.db.object('/game/players/' + kv[0].key).set(kv[0].val)
      );
  }

  getAvatar(name) {
    return this.avatarService.getAvatar(name);
  }
  kickPlayer(player){
    this.playersRef.remove(player.key);
  }
  randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  startGame() {
    this.players.pipe(first()).subscribe(players =>
     {
      //  let playersSet = new Set();
      //  for (var player in players) {
      //     playersSet.add(player);
      //  }
       let numPlayers = players.length;
       let canSee = {
         blue: {
         },
         worst: {
         },
         merlin: {
           spy: true,
           assasin: true,
           morgana: true,
         },
         percival: {
           merlin: true,
           morgana: true,
         },
         spy: {
           spy: true,
           assasin: true,
           morgana: true,
           mordred: true,
         },
         assasin: {
           spy: true,
           morgana: true,
           mordred: true,
         },
         morgana: {
           spy: true,
           assasin: true,
           mordred: true,
         },
         mordred: {
           spy: true,
           assasin: true,
           morgana: true,
         },
       };
      // const arrayToObject = (array) =>
      //   array.reduce((obj, item) => {
      //     obj[item.key] = item
      //     return obj
      //   }, {});
      // let playersObj = arrayToObject(players);
      const getNFakeThumbs = (n, player, players) => {
        let rval = [];
        let others = players.filter((other) => {
          return player !== other;
        });
        for (;n>0;n--) {
          let i = this.randomInt(0,others.length-1);
          rval.push(others[i].name);
          others.splice(i, 1);
        }
        return rval;
      };
       let nightInfo = {};
       const xxx = (roles) => {
         let first_to_propose_player = players[this.randomInt(0,players.length-1)];
        first_to_propose_player['first_to_propose'] = true;
        players.forEach(player => {
          let i = this.randomInt(0,roles.length-1);
          let role = roles[i];
          roles.splice(i, 1);
          nightInfo[player.name] = {
            role: role,
            thumbs: [],
            fakeThumbs: [],
            firstToPropose: player.first_to_propose ? true : false,
            firstToProposePlayer: first_to_propose_player.name,
          };
        });
        let thumbCounts = [];
        players.forEach(player => {
          let role = nightInfo[player.name].role;
          players.forEach(other => {
            if (player !== other) {
              let otherRole = nightInfo[other.name].role;
              if (canSee[role][otherRole]) {
                nightInfo[player.name].thumbs.push(other.name);
              }
            }
          });
          if (nightInfo[player.name].thumbs.length > 0) {
            thumbCounts.push(nightInfo[player.name].thumbs.length);
          }
        });
        players.forEach(player => {
          if (nightInfo[player.name].thumbs.length > 0) {
            nightInfo[player.name].fakeThumbs = nightInfo[player.name].thumbs;
          } else {
            let numFakeThumbs = thumbCounts[this.randomInt(0,thumbCounts.length-1)];
            nightInfo[player.name].fakeThumbs = getNFakeThumbs(numFakeThumbs, player, players);
          }
        });
       };
       switch(numPlayers) {
          case 1: { 
              xxx(['blue']);
              break;
          }
          case 2: { 
              xxx(['spy','blue']);
              break;
          }
          case 3: { 
              xxx(['spy','blue','blue']);
              break;
          }
          case 4: { 
              xxx(['spy','blue','blue','blue']);
              break;
          }
          case 5: { 
              xxx(['spy','spy','blue','blue','blue']);
              break;
          }
          case 6: { 
              xxx(['spy','spy','blue','blue','blue','blue']);
              break;
          }
          case 7: { 
              xxx(['assasin','morgana','mordred','merlin','percival','blue','blue']);
              break; 
          }
          case 8: { 
              xxx(['assasin','morgana','mordred','merlin','percival','blue','blue','blue']);
              break; 
          }
          case 9: { 
              xxx(['assasin','morgana','mordred','merlin','percival','blue','blue','blue','worst']);
              break; 
          }
          case 10: { 
              xxx(['assasin','morgana','mordred','merlin','percival','blue','blue','blue','blue','spy']);
              break; 
          } 
          case 11: { 
              xxx(['assasin','morgana','mordred','merlin','percival','blue','blue','blue','blue','spy','blue']);
              break; 
          } 
          default: { 
              //statements; 
              break; 
          } 
       }
      // this.gameRef.set({state: 'night-phase', players:playersObj});
      this.gameRef.set({state: 'night-phase', nightInfo: nightInfo});
      //  console.log(this.randomInt(0,4));console.log(players[0].name);
     });
  }
  
  role = null;
  firstToPropose = null;
  firstToProposePlayer = null;
  thumbs = null;
  allRoles = null;
  showRoles = null;
  isNightPhase(game) {
    if (!game || game.state != 'night-phase' || !game['nightInfo']) return false;
    if (!game['nightInfo'][this.selectedPlayer]) return false;
    return game.state === 'night-phase';
  }

  showRolesFn() {
    this.db.object('/game/showRoles').set(true);
  }
  //gameSynced;
  isNightPhaseX(game) {
    if (!game) return false;
    //this.gameSynced = game;
    return game.state === 'night-phase';
  }

  
  
  toggleChaosMode() {
    this.chaosModeRef.valueChanges().pipe(first())
    .subscribe(m => this.chaosModeRef.set(!m))
  }

}