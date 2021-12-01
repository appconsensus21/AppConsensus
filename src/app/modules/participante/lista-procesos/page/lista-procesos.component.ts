import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { ParticipanteService } from 'src/app/services/participante.service';
import { UtilidadServiceService } from 'src/app/services/utilidad-service.service';
import { IngresoProcesoComponent } from '../../components/ingreso-proceso/ingreso-proceso.component';
import { CambiarContrasenaComponent } from 'src/app/modules/moderador/components/cambiar-contrasena/cambiar-contrasena.component';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-lista-procesos',
  templateUrl: './lista-procesos.component.html',
  styleUrls: ['./lista-procesos.component.css', '../../../administrador/consensos/page/consenso.component.css',
    '../../../administrador/moderadores/page/moderadores.component.css']
})

/**
 * Participante
 * Controlador de la Página Lista Procesos: 
 * - Permite visualizar los procesos de consenso.
 */

export class ListaProcesosComponent implements OnInit, AfterContentChecked {
  
  public user: any;
  public actualizarPswd: boolean = false;
  public consensos: any = [];
  public consensosfinalizados: any = [];
  public consensospausados: any = [];

  constructor(
    public router: Router,
    private dialog: MatDialog,
    private changedetector: ChangeDetectorRef,
    private _servicioNotificacion: ToastrService,
    private _servicioUsuario: UsuarioService,
    private _servicioParticipante: ParticipanteService
    ) { }

  async ngOnInit() {
    await this.getUser();
    await this.getListaProcesosByUser();
    this.actualizarPswd = await this.user.pswd !== '';
    if (this.actualizarPswd && this.user.rol == "participante") {
      const toast = this._servicioNotificacion.warning('Presione este diálogo para cambiar la contraseña', 'Cambiar contraseña', {
        timeOut: 0,
        extendedTimeOut: 0,
        tapToDismiss: this.actualizarPswd
      });
      toast.onTap.subscribe(() => this.updatePassword())
    }
  }

  ngAfterContentChecked(): void {
    this.changedetector.detectChanges();
  }

  private async getListaProcesosByUser() {
    this.consensos = []
    this.consensosfinalizados = []
    await this.getUser();
    let registro = (this._servicioParticipante._recuperarRegistros(this.user.uid)).pipe(take(1)).toPromise();
    await registro.then((value) => {
      value.forEach((element: any) => {
        let proceso = (this._servicioParticipante._recuperarConsensosParticipante(element.id)).pipe(take(1)).toPromise();
        proceso.then((info) => {
          if (info.length != 0) {
            if (info[0].estado === 'iniciado') {
              if (!this.consensos.includes(info[0])) {
                this.consensos.push(info[0])
              }
            } else if (info[0].estado === 'pausado') {
              if (!this.consensospausados.includes(info[0])) {
                this.consensospausados.push(info[0])
              }
            }
             else if (info[0].estado === 'finalizado') {
              if (!this.consensosfinalizados.includes(info[0])) {
              this.consensosfinalizados.push(info[0])
             }
            }
          }
        })
      });
    })
  }

  private async updatePassword() {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CambiarContrasenaComponent, dialogConfig)
      .afterClosed().subscribe(data => {
        this.actualizarPswd = data;
      })
  }

  public async ingresarConsenso() {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      iduser: this.user.uid
    }
    this.dialog.open(IngresoProcesoComponent, dialogConfig).afterClosed().subscribe(async (agg: any) => {
      if (agg.agg) {
        await this.getListaProcesosByUser();
      }
    });
  }

  private async getUser() {
    this.user = await this._servicioUsuario._recuperarDataUsuario();
  }

  public evaluacion(id: string) {
    this.router.navigate([`appParticipante/evaluacionProceso/${id}`]);
  }

  public resultados(id: string) {
    this.router.navigate([`appParticipante/resultados/${id}`]);
  }
}
