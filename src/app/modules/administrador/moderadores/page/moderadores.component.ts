import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InvitacionAModeradorComponent } from '../../components/invitacion-amoderador/invitacion-amoderador.component';
import { AdministradorService } from '../../../../services/administrador.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-moderadores',
  templateUrl: './moderadores.component.html',
  styleUrls: ['./moderadores.component.css']
})
/**
 * Administrador
 * Controlador de la Página Moderadores: 
 * - Muestra los moderadores del sistema.
 * - Permite agregar nuevos moderadores al sistema.
 */

export class ModeradoresComponent implements OnInit {

  public displayedColumns: string[] = ['nombre', 'email', 'activo'];
  public dataSource = new MatTableDataSource();

  constructor(
    private dialog: MatDialog,
    private _servicioAdmin: AdministradorService
  ) { }

  ngOnInit(): void {
    this._servicioAdmin._recuperarModeradores()
      .subscribe((moderador) => this.dataSource.data = moderador);
  }

  async _invitar() {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(InvitacionAModeradorComponent, dialogConfig);
  }

}
