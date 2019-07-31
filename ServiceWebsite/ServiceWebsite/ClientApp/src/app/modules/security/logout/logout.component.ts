import { Component, OnInit } from '@angular/core';
import { AdalService } from 'adal-angular4';
import { Paths } from '../paths';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  readonly loginPath = '../' + Paths.Login;

  constructor(private adalSvc: AdalService) {}

  get loggedIn(): boolean {
    console.log(this.loginPath);
    return this.adalSvc.userInfo.authenticated;
  }

  ngOnInit() {
    sessionStorage.clear();

    if (this.loggedIn) {
      this.adalSvc.logOut();
    }
  }
}
