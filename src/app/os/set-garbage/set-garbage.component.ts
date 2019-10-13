import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-set-garbage',
  templateUrl: './set-garbage.component.html',
  styleUrls: ['./set-garbage.component.css']
})
export class SetGarbageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    localStorage.setItem('os_type', 'garbage');
  }

}