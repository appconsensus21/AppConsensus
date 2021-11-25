import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
export class ApplayoutModComponent implements OnInit, OnDestroy  {
  sideMenuItems: any;
  togglenavbar = false;
  username = '';
  public toggleFlag = false;
  
  @ViewChild('sidenav')
  public sidenav!: MatSidenav;
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    public authService: AngularFireAuth,
    private toastr: ToastrService,
    private _servicioUsuario: UsuarioService
    ) {

  }

  ngOnInit() {
    this.sideMenuItems = environment.menuItemsModerador;
    this.togglenavbar = this.route.snapshot.data['navbar'];
    this.getCurrentUser();
  }

  ngOnDestroy(){
    this._servicioUsuario.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.togglenavbar) {
    }
  }

  logout() {
    this._servicioUsuario.logout();
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
