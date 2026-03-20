import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private readonly apiService: Api, private router: Router){

  }
  get isAuthenticated(): boolean{
    return this.apiService.isAuthenticated();
  }

  handleLogOut():void{
    const isLogout = window.confirm("Are you sure want to Logout")
    if(isLogout){
      this.apiService.logOut();
      this.router.navigate(['/login'])
    }
  }
}
