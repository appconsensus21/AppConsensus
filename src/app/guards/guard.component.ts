import { Injectable, OnInit } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router'; 
import { UsuarioService } from '../services/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GuardComponent implements OnInit,CanActivate {

  public isAdmin = false;
  public isModerador = false;
  public isParcipante = false;
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
      if(res.rol=="moderador"){
        this.isModerador = true;
      }
      if(res.rol=="participante"){
        this.isParcipante = true;
      }

    })
  }
  
  async canActivate() {
    await this.ngOnInit();
    if (!this.isAdmin) {
      this._servicioNotificaciones.error("No tiene permisos de administrador!");
      if(this.isModerador){
        this._router.navigate(['appModerador/home']);
      }
      if(this.isParcipante){
        this._router.navigate(['appParticipante/listaConsensos']);
      }
    }
    return this.isAdmin;
  }
}