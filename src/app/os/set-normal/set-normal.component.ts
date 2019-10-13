import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-set-normal',
  templateUrl: './set-normal.component.html',
  styleUrls: ['./set-normal.component.css']
})
export class SetNormalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    localStorage.setItem('os_type', 'normal');
  }

}