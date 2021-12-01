import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-applayout-part',
  templateUrl: './applayout-part.component.html',
  styleUrls: ['./applayout-part.component.css']
})
export class ApplayoutPartComponent implements OnInit,OnDestroy, AfterViewInit  {
  sideMenuItems: any;
  togglenavbar = false;
  username = '';
  public toggleFlag = false;

  constructor(private route: ActivatedRoute, private router: Router, public authService: AngularFireAuth,
    private _servicioNotificaciones: ToastrService,
    private _servicioUsuario: UsuarioService
    ) {

  }

  async ngOnInit() {
    this.sideMenuItems = environment.menuItemsParticipante;
    await this.getCurrentUser();
  }

  ngAfterViewInit() {
    //this.verificarRol();
  }

  ngOnDestroy() {
    this._servicioUsuario.unsubscribe();
  }

  openDropDown(){
    this.toggleFlag = !this.toggleFlag; 
  }

  logout() {
    this._servicioUsuario.logout(true);
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
