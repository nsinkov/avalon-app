import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-set-noob',
  templateUrl: './set-noob.component.html',
  styleUrls: ['./set-noob.component.css']
})
export class SetNoobComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    localStorage.setItem('user_type', 'noob');
  }

}