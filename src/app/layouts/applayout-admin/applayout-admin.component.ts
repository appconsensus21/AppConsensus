import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSidenav } from '@angular/material/sidenav';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-applayout-admin',
  templateUrl: './applayout-admin.component.html',
  styleUrls: ['./applayout-admin.component.css', '../applayout/applayout.component.css']
})
export class ApplayoutAdminComponent implements OnInit, OnDestroy , AfterViewInit {
  sideMenuItems: any;
  togglenavbar = false;

  @ViewChild('sidenav')
  public sidenav!: MatSidenav;
  constructor(
    public authService: AngularFireAuth,
    private _servicioUsuario: UsuarioService,
    private _servicioNotificaciones: ToastrService,
 ) {

  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this._servicioUsuario.unsubscribe();
  }

  ngAfterViewInit() {
    this.verificarRol();
  }

  private verificarRol(){
    this._servicioUsuario._recuperarDataUsuario().then((res:any)=>{
      if(res.rol!="administrador"){
        this._servicioNotificaciones.error('No tiene permisos de administrador!');
        this._servicioUsuario.logout(false);
      }
    })
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

}
