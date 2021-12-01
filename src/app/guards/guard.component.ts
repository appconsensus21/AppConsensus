import { Injectable, OnInit } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Router } from '@angular/router'; 
import { UsuarioService } from '../services/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GuardComponent implements OnInit,CanActivate {

  public isAdmin = false;
  constructor(private _router: Router,
    private _servicioUsuario: UsuarioService,
    private _servicioNotificaciones: ToastrService
    ) {
  }

  async ngOnInit(){
    await this._servicioUsuario._recuperarDataUsuario().then((res:any)=>{
      if(res.rol=="administrador"){
        this.isAdmin = true;
      }
    })
  }
  
  async canActivate() {
    await this.ngOnInit();
    if (!this.isAdmin) {
      this._servicioNotificaciones.error("No tiene permisos de administrador!");
      this._router.navigate(['login']);
    }
    return this.isAdmin;
  }
}