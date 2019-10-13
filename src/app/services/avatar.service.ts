import { Injectable } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';

@Injectable()
export class AvatarService {

  avatars = {};
  //url404 = "assets/Blank-Face.jpg";
  url404 = "https://raw.githubusercontent.com/nsinkov/avalon-app/master/src/assets/Blank-Face.jpg";
  constructor(private afStorage: AngularFireStorage) {
    
  }

   getAvatar(name) {
    if (this.avatars[name]) {
      return this.avatars[name];
    }
    else {
        this.avatars[name] = this.url404;
    }
  
    this.afStorage.ref('/avatars/' + name + '.jpg').getDownloadURL()
    .subscribe(url => {
     if (!this.avatars[name] || this.avatars[name] == this.url404)
        this.avatars[name] = url;
     },
     err => {
     if (!this.avatars[name]) this.avatars[name] = 'https://www.google.com/logos/doodles/2019/50th-anniversary-of-the-moon-landing-6524862532157440.3-s.png';
     console.log(err);
     });
    return this.avatars[name];
  }
}