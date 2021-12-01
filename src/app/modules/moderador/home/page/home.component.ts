import { Component, OnChanges, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CambiarContrasenaComponent } from 'src/app/modules/moderador/components/cambiar-contrasena/cambiar-contrasena.component';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../../administrador/home/page/home.component.css']
})

/**
 * Moderador
 * Controlador de la Página Home: 
 * - Página de inicio, permite observar las opciones del moderador.
 */

export class HomeComponent implements OnInit , OnChanges{
  public user: any;
  public needupdatePass: boolean = false;

  constructor(
    public dialog: MatDialog,
    private _servicioNotificacion: ToastrService,
    private _servicioUsuario: UsuarioService
    ) { }

  async ngOnInit() {
    await this.getUser();
    this.needupdatePass = await this.user.pswd !== '';
    if(this.needupdatePass && this.user.rol == "moderador"){
      const toast = this._servicioNotificacion.warning('Presione este diálogo para cambiar la contraseña','Cambiar contraseña',{
        timeOut: 0,
        extendedTimeOut: 0,
        tapToDismiss: this.needupdatePass
      });
      toast.onTap.subscribe(()=> this.updatePassword())
    }
  }

  async ngOnChanges(){
    this.ngOnInit();
  }

  private async updatePassword() {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CambiarContrasenaComponent, dialogConfig)
    .afterClosed().subscribe(data => {
      this.needupdatePass = data;
    })
  }

  private async getUser() {
    this.user = await this._servicioUsuario._recuperarDataUsuario();
  }
}
