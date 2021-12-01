import { Injectable, OnInit } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Router } from '@angular/router'; 
import { UsuarioService } from '../services/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GuardParticipanteComponent implements OnInit,CanActivate {

  public isParticipante = false;
  constructor(private _router: Router,
    private _servicioUsuario: UsuarioService,
    private _servicioNotificaciones: ToastrService
    ) {
  }

  async ngOnInit(){
    await this._servicioUsuario._recuperarDataUsuario().then((res:any)=>{
      if(res.rol=="participante"){
        this.isParticipante = true;
      }
    })
  }
  
  async canActivate() {
    await this.ngOnInit();
    if (!this.isParticipante) {
      this._servicioNotificaciones.error("No tiene permisos de participante!");
      this._router.navigate(['login']);
    }
    return this.isParticipante;
  }
}