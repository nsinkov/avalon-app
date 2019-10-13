import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { SetAdminComponent } from './dummy-auth/set-admin/set-admin.component';
import { SetNoobComponent } from './dummy-auth/set-noob/set-noob.component';
import { SetNormalComponent } from './os/set-normal/set-normal.component';
import { SetGarbageComponent } from './os/set-garbage/set-garbage.component';
import { GameComponent } from './game/game.component';
import { NewPlayerComponent } from './new-player/new-player.component';
import { PlayersComponent } from './players/players.component';
import { TopBarComponent } from './top-bar/top-bar.component';

import { AvatarService } from './services/avatar.service';
import { BroadcastService } from './services/broadcast.service';

import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule  } from '@angular/fire/database';
import { AngularFireStorageModule  } from '@angular/fire/storage';

import { ImageToDataUrlModule } from "ngx-image2dataurl";
import { StickyNavModule } from 'ng2-sticky-nav';

import {MatButtonModule, MatInputModule, MatSliderModule, MatDialogModule, MatFormFieldModule } from '@angular/material'
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { TestGameComponent } from './test-game/test-game.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    // NoopAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: GameComponent },
      { path: 'test', component: TestGameComponent },
      { path: 'new_player', component: NewPlayerComponent },
      { path: 'players', component: PlayersComponent },
      { path: 'admin', component: SetAdminComponent },
      { path: 'noob', component: SetNoobComponent },
      { path: 'android', component: SetNormalComponent },
      { path: 'ios', component: SetGarbageComponent },
    ]),
    AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    ImageToDataUrlModule,
    StickyNavModule,

    MatButtonModule,
    MatInputModule,
    // MatSliderModule,
    // MatDialogModule,
    // MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule
  ],
  declarations: [
    AppComponent,
    SetAdminComponent,
    SetNoobComponent,
    GameComponent,
    NewPlayerComponent,
    PlayersComponent,
    TopBarComponent,
    SetNormalComponent,
    SetGarbageComponent,
    TestGameComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [ BroadcastService, AvatarService ]
})
export class AppModule { }
