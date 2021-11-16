import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModeradorService } from '../../../../services/moderador.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { UtilidadServiceService } from '../../../../services/utilidad-service.service';
import { ConsensoServiceService } from '../../../../services/consenso-service.service';
import firebase from 'firebase/app'
import { FileUpload } from '../../../../interfaces/file-upload';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  public displayedColumnsItems: string[] = ['clave', 'valor', 'activo'];
  public dataSourceItem = new MatTableDataSource();
  private auxTableItems: any = [];
  private selectedFiles?: FileList;
  private currentFileUpload?: FileUpload;
  public urlimagen: any = '';
  private basePath = '/uploads';

  constructor(
    public _formBuilder: FormBuilder,
    public _servicioModerador: ModeradorService,
    private dialogRef: MatDialogRef<AddItemComponent>,
    private _servicioNotificacion: ToastrService,
    public _servicioUtilidad: UtilidadServiceService,
    public _servicioConsenso: ConsensoServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  itemform = this._formBuilder.group({
    itemname: ['', [Validators.required]],
    description: ['']
  })

  metadataform = this._formBuilder.group({
    clave: ['', [Validators.required]],
    valor: ['', [Validators.required]]
  })

  public selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  private async pushFileToStorage(fileUpload: FileUpload) {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = firebase.storage().ref(filePath);
    await storageRef.put(fileUpload.file).then((resp) => {
      const storage = firebase.storage();
      const sref = storage.ref();
      sref.child(filePath)
        .getDownloadURL()
        .then((url) => {
          this.urlimagen = url
        })
        .catch((err) => {
          this._servicioNotificacion.error('No fue posible subir la imagen')
        })
    });
  }

  private async upload() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        await this.pushFileToStorage(this.currentFileUpload);
      }
    }
  }

  public addMetadata() {
    this.auxTableItems.push(
      {
        clave: this.metadataform.get('clave')?.value,
        valor: this.metadataform.get('valor')?.value
      }
    );
    this.metadataform.reset();
    this.dataSourceItem.data = this.auxTableItems;
  }

  public removeMetadata(element: any) {
    this.auxTableItems = this.auxTableItems.filter((obj: any) => obj !== element);
    this.dataSourceItem.data = this.auxTableItems;
  }

  public async onSubmit() {
    const recordItem = {
      nombre: this.itemform.get('itemname')?.value,
      descripcion: this.itemform.get('description')?.value,
      id_proceso_consenso: this.data.id_consenso,
      metadata: this.auxTableItems,
      atributosaceptacion: [],
      atributosrechazo: [],
      foto: this.urlimagen
    }

    await this._servicioConsenso
      ._crearItem(recordItem)
      .then((result) => {
        this._servicioNotificacion.success('Item agregado', '¡Éxito!');
      }).catch((err) => {
        this._servicioNotificacion.error('Error al crear item');
      });
    this.dialogRef.close();
  }
}
