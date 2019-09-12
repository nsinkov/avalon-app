import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-set-admin',
  templateUrl: './set-admin.component.html',
  styleUrls: ['./set-admin.component.css']
})
export class SetAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    localStorage.setItem('user_type', 'admin');
  }

}