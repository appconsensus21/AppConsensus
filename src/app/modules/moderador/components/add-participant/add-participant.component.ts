import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModeradorService } from '../../../../services/moderador.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UtilidadServiceService } from '../../../../services/utilidad-service.service';
import { ConsensoServiceService } from '../../../../services/consenso-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import '@firebase/storage';

@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.css']
})
export class AddParticipantComponent implements OnInit {

  public displayedColumns: string[] = ['nombres', 'apellidos', 'correo', 'activo'];
  public dataSource = new MatTableDataSource();
  public displayedColumnscsv: string[] = ['nombres', 'apellidos', 'correo'];
  public dataSourcecsv = new MatTableDataSource();

  public auxTable: any = [];
  public auxTableCsv: any = [];
  public participantes: any = [];
  public header = true;

  @ViewChild('paginatorcsv') paginatorcsv!: MatPaginator;
  @ViewChild('paginatorlistado') paginatorlistado!: MatPaginator;
  @ViewChild('fileparticipantes', { static: false }) fileparticipantes: any;

  constructor(
    public _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddParticipantComponent>,
    public _servicioModerador: ModeradorService,
    private _servicioNotificacion: ToastrService,
    public _servicioUtilidad: UtilidadServiceService,
    public _servicioConsenso: ConsensoServiceService,
    private ngxCsvParser: NgxCsvParser,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this._servicioModerador._recuperarParticipantes().subscribe(participante => {
      this.dataSource.data = participante;
      this.dataSource.paginator = this.paginatorlistado;
      this.dataSourcecsv.paginator = this.paginatorcsv;
    })
  }

  participanteform = this._formBuilder.group({
    username: [''],
    email: ['']
  })

  public close() {
    this.dialogRef.close();
  }

  public invitarExistentes() {
    this.dialogRef.close({ participantes: this.auxTable });
  }

  public async invitar() {
    this.dialogRef.close({ participantes: this.auxTableCsv })
  }

  public checkboxAgregar(event: any, element: any) {
    if (event) {
      if (!this.auxTable.includes(element)) {
        this.auxTable.push(element)
      }
    } else {
      if (this.auxTable.includes(element)) {
        this.auxTable = this.auxTable.filter((obj: any) => obj !== element);
      }
    }
  }

  public leerCsv($event: any) {
    const files = $event.srcElement.files;
    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ';' })
      .pipe().subscribe((result: any) => {
        result.forEach((element: any) => {
          const data = {
            nombres: element.Nombres,
            apellidos: element.Apellidos,
            correo: element.Email
          }
          this.auxTableCsv.push(data);
        });

        this.dataSourcecsv.data = this.auxTableCsv;
      }, (error: NgxCSVParserError) => {
        this._servicioNotificacion.error(error.message, 'Error')
      })
  }
}
