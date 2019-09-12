import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { Options, ImageResult, createImageFromDataUrl, getImageTypeFromDataUrl, ImageFileProcessor } from "ngx-image2dataurl";

@Component({
  selector: 'app-new-player',
  templateUrl: './new-player.component.html',
  styleUrls: ['./new-player.component.css']
})
export class NewPlayerComponent implements OnInit {
  profileUrl: Observable<string | null>;
  src: string = "";
  options: Options = {
    resize: {
      maxHeight: 160,
      maxWidth: 160,
      quality: 0.95,
    },
  };
  rotation: number = 90;
  playerName = "";

  public players;
  constructor(private afStorage: AngularFireStorage, db: AngularFireDatabase) {
    // const ref = this.afStorage.ref('/avatars/bob.jpg');
    // this.profileUrl = ref.getDownloadURL(); 
    this.players = db.list('/players');
  }

  upload(event) {
    console.log(event.target.files[0].name);
    this.afStorage.upload('/avatars/bob.jpg', event.target.files[0]); 

  }

  reload() {
     const ref = this.afStorage.ref('/avatars/bob.jpg');
     this.profileUrl = ref.getDownloadURL(); 

  }

  
  async process(dataURL: string, angle): Promise<string> {
    const canvas = document.createElement('canvas');
    const image = await createImageFromDataUrl(dataURL);
    canvas.width = image.height;
    canvas.height = image.width;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
    return canvas.toDataURL(getImageTypeFromDataUrl(dataURL));
  }
  async rotate() {
    this.src = await this.process(this.src, this.rotation);
  }
  selected(imageResult: ImageResult) {
      console.log(imageResult.file.name);
      
    if (imageResult.error) alert(imageResult.error);
    this.src = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
      
      //this.afStorage.upload('/avatars/bob.jpg', imageResult.file); 
      //this.afStorage.ref('/avatars/bob.jpg').putString(this.src, 'data_url'); 
  }
  createPlayer() {
    if(!this.playerName || !this.playerName.replace(/[^0-9a-zA-Z_-]/g, '')){
      alert("Must pick player name");
      return;
    }
    if(!this.src) {
      alert("Must pick avatar");
      return;
    }
    var uname = this.playerName.replace(/[^0-9a-zA-Z_-]/g, '');
    console.log(uname);
    this.afStorage.ref('/avatars/' + uname + '.jpg').putString(this.src, 'data_url');
    this.players.push({name:uname}).then(x=> alert('Created player ' + uname));
  }
  ngOnInit() {
  }

}