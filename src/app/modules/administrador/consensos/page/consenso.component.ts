import { Component, OnInit } from '@angular/core';
import { AdministradorService } from 'src/app/services/administrador.service';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consenso',
  templateUrl: './consenso.component.html',
  styleUrls: ['./consenso.component.css', '../../moderadores/page/moderadores.component.css'],
})
/**
 * Administrador
 * Controlador de la Página Consenso: 
 * - Muestra los procesos de consenso del sistema
 */
export class ConsensoComponent implements OnInit {

  public _consensos: any = [];

  constructor(
    private _servicioAdmin: AdministradorService,
    private _servicioNotificacion: ToastrService
    ) { }

  ngOnInit(): void {
    this._servicioAdmin._recuperarConsensosAdministrador().pipe(take(1)).toPromise()
    .then((consenso: any) => 
        this._consensos = consenso
    ).catch((error: { message: string; })=>{
      this._servicioNotificacion.error(error.message, 'Error' );
    });
  }

}
