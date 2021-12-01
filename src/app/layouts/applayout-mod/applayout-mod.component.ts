import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-applayout-mod',
  templateUrl: './applayout-mod.component.html',
  styleUrls: ['./applayout-mod.component.css', '../applayout/applayout.component.css']
})
export class ApplayoutModComponent implements OnInit, OnDestroy, AfterViewInit {
  sideMenuItems: any;
  togglenavbar = false;
  username = '';
  public toggleFlag = false;
  
  @ViewChild('sidenav')
  public sidenav!: MatSidenav;
  constructor(
    private route: ActivatedRoute, 
    public authService: AngularFireAuth,
    private _servicioUsuario: UsuarioService,
    private _servicioNotificaciones: ToastrService
    ) {

  }

  ngOnDestroy(){
    this._servicioUsuario.unsubscribe();
  }

  ngOnInit() {
    this.sideMenuItems = environment.menuItemsModerador;
    this.togglenavbar = this.route.snapshot.data['navbar'];
    this.getCurrentUser();
  }

  ngAfterViewInit() {
    //this.verificarRol();
  }

  logout() { 
    this._servicioUsuario.logout(true);
  }

  openDropDown(){
    this.toggleFlag = !this.toggleFlag; 
  }

  isLargeScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width > 720) {
      return true;
    } else {
      return false;
    }
  }

  async getCurrentUser(){
    let user = await this._servicioUsuario._recuperarDataUsuario() as any;
    this.username = user.nombres+ ' '+ user.apellidos;
  }

}
