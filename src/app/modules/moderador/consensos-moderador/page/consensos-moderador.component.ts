import { AfterContentChecked, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModeradorService } from '../../../../services/moderador.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-consensos-moderador',
  templateUrl: './consensos-moderador.component.html',
  styleUrls: ['./consensos-moderador.component.css', '../../../administrador/consensos/page/consenso.component.css',
    '../../../administrador/moderadores/page/moderadores.component.css']
})

/**
 * Moderador
 * Controlador de la Página Consensos Moderador: 
 * - Permite observar los procesos consensos creados por el moderador 
 */
export class ConsensosModeradorComponent implements OnInit, AfterContentChecked {

  public user: any;
  public consensosNoInit: any = [];
  public consensosInit: any = [];
  public consensosPausados: any = [];
  public consensosFinalizados: any = [];
  public existNoInit = false;
  public existInit= false;
  public existPausados = false;
  public existFinalizados = false;

  constructor(
    public router: Router,
    private _servicioModerador: ModeradorService,
    private _servicioNotificacion: ToastrService,
    private changedetector: ChangeDetectorRef,
    private SpinnerService: NgxSpinnerService,
    private _servicioUsuario: UsuarioService
  ) { }

  async ngOnInit() {
    await this.getUser();
    await this.getConsensos();
  }

  ngAfterContentChecked() : void {
    this.changedetector.detectChanges();
}

  private async getUser() {
    this.user = await this._servicioUsuario._recuperarDataUsuario();
  }

  public configuracion(id_proceso: string) {
    this.router.navigate([`appModerador/configconsenso/${id_proceso}`])
  }

  private async getConsensos(){
    this.SpinnerService.show();
    let consensos = this._servicioModerador._recuperarConsensosModerador(this.user.uid).pipe(take(1)).toPromise()
    await consensos.then((content: any)=>{
        content.forEach((element: any) => {
        if (element.estado == 'No iniciado') {
          this.existNoInit = true;
          this.consensosNoInit.push(element)
        } else if (element.estado == 'iniciado') {
          this.existInit = true;
          this.consensosInit.push(element)
        } else if (element.estado == 'pausado') {
          this.existPausados = true;
          this.consensosPausados.push(element)
        } else if (element.estado == 'finalizado') {
          this.existFinalizados = true;
          this.consensosFinalizados.push(element)
        }
      });
      this.SpinnerService.hide();
    }).catch((error: { message: string; })=>{
      this._servicioNotificacion.error(error.message, 'Error' );
      this.SpinnerService.hide();
    });
  }
}
