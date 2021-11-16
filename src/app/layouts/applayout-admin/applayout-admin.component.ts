import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-applayout-admin',
  templateUrl: './applayout-admin.component.html',
  styleUrls: ['./applayout-admin.component.css', '../applayout/applayout.component.css']
})
export class ApplayoutAdminComponent implements OnInit {
  sideMenuItems: any;
  togglenavbar = false;

  @ViewChild('sidenav')
  public sidenav!: MatSidenav;
  constructor(private route: ActivatedRoute, private router: Router, public authService: AngularFireAuth,
    private toastr: ToastrService,
    private dialog: MatDialog) {

  }

  ngOnInit() {
    this.sideMenuItems = environment.menuItemsAdministrador;
    this.togglenavbar = this.route.snapshot.data['navbar'];
  }

  ngAfterViewInit() {
    if (this.togglenavbar) {
    }
  }

  async logout() {
    this.router.navigate(['/login']);
    this.authService.signOut().then(() => {
      this.toastr.info('Sesión cerrada correctamente', '¡Hasta Luego!');
    });
  }

  isLargeScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width > 720) {
      return true;
    } else {
      return false;
    }
  }

}
