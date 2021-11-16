import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogLogoutComponent implements OnInit {

  constructor(
    public dialogo: MatDialogRef<ConfirmationDialogLogoutComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: any
  ) { }

  ngOnInit(): void {
  }

  cancelar(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {
    this.dialogo.close(true);
  }

}
