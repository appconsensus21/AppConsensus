import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilidadServiceService } from 'src/app/services/utilidad-service.service';
import { ConsensoServiceService } from '../../../../services/consenso-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-nuevo-consenso',
  templateUrl: './nuevo-consenso.component.html',
  styleUrls: ['./nuevo-consenso.component.css',
    '../../../administrador/moderadores/page/moderadores.component.css']
})
/**
 * Moderador
 * Controlador de la Página Nuevo Consenso: 
 * - Permite la creación de un proceso de consenso, especificando los parámetros de:
 *  - Nombre y descripción del proceso de consenso.
 *  - Número de rondas.
 *  - Duración de las rondas .
 *  - Consenso esperado.
 *  - Fecha y hora de inicio del proceso de consenso.
 */

export class NuevoConsensoComponent implements OnInit {

  public firstFormGroup!: FormGroup; //Primera parte de la creación de un proceso de consenso
  public secondFormGroup!: FormGroup; //Segunda parte de la creación de un proceso de consenso
  public codigo = ''
  public fechaMinima = new Date();
  public timeFormat = [   //Formatos disponibles, el valor corresponde al formato en horas.
    { formato: 'Hora(s)', valor: 1 },
    { formato: 'Día(s)', valor: 24 },
    { formato: 'Semana(s)', valor: 168 },
  ]
  private user: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _servicioNotificacion: ToastrService,
    private _servicioUtilidad: UtilidadServiceService,
    private _servicioConsenso: ConsensoServiceService,
    public router: Router, public route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private _servicioUsuario: UsuarioService
  ) { }

  async ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      code: ['', Validators.required],
      groupname: ['', Validators.required],
      topic: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      rondas: ['', Validators.required],
      duracion: ['', Validators.required],
      format: ['', Validators.required],
      nivel: ['', Validators.required,],
      fecha: ['', Validators.required],
    });
    await this.getUser();
  }

  private async getUser() {
    this.user = await this._servicioUsuario._recuperarDataUsuario();
    const fecha = new Date()
    this.codigo = fecha.getUTCFullYear().toString() + '' + fecha.getMonth().toString() +
      fecha.getDay().toString() + this._servicioUtilidad._generaPassword();
  }

  public async crearConsenso() {
    this.SpinnerService.show();
    const hora = this.secondFormGroup.get('fecha')?.value as Date
    const utc = hora.toString().split('-')[1].split(' ')[0]
    if (this.secondFormGroup.get('nivel')?.value > 1 || this.secondFormGroup.get('nivel')?.value < 0) {
      this._servicioNotificacion.warning('El nivel de consenso no es correcto');
      this.SpinnerService.hide();
    } else if (!this.secondFormGroup.valid) {
      this._servicioNotificacion.warning('El formulario no es correcto');
      this.SpinnerService.hide();
    } else {
      const newId = this._servicioUtilidad._generarId();
      const record = {
        id_proceso_consenso: newId,
        id_moderador: this.user.uid,
        codigo: this.firstFormGroup.get('code')?.value,
        nombre_consenso: this.firstFormGroup.get('groupname')?.value,
        descripcion: this.firstFormGroup.get('topic')?.value,
        estado: 'No iniciado',
        fecha_inicio: this.secondFormGroup.get('fecha')?.value,
        nivel_consenso: this.secondFormGroup.get('nivel')?.value,
        periodo_rondas: this.secondFormGroup.get('duracion')?.value * this.secondFormGroup.get('format')?.value,
        rondas: this.secondFormGroup.get('rondas')?.value,
        participantes_totales: 0
      }

      await this._servicioConsenso
        ._crearConsenso(record)
        .then((result) => {
          this._servicioNotificacion.success('Proceso de consenso creado', '¡Éxito!');
          this.toConfigConsensus(newId);
        }).catch((err) => {
          this._servicioNotificacion.error('Error al crear el proceso de consenso');
        }).finally(() => {
          this.SpinnerService.hide();
        });
    }
  }

  private toConfigConsensus(id: string) {
    this.router.navigate([`appModerador/configconsenso/${id}`]);
  }
}
