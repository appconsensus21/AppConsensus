import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-applayout',
  templateUrl: './applayout.component.html',
  styleUrls: ['./applayout.component.css']
})
export class ApplayoutComponent implements OnInit {
  sideMenuItems: any;
  togglenavbar = false;

  @ViewChild('sidenav')
  public sidenav!: MatSidenav;
  constructor(private route: ActivatedRoute, private router: Router, public authService: AngularFireAuth,
    private toastr: ToastrService) {

  }

  ngOnInit() {
    this.sideMenuItems = environment.menuItemsAdministrador;
    this.togglenavbar = this.route.snapshot.data['navbar'];
  }

  ngAfterViewInit() {
    if (this.togglenavbar) {
      //this.sidenav.toggle();
    }
  }

  logout() {
    this.toastr.info('Sesión cerrada correctamente', '¡Hasta Luego!');
    this.authService.signOut();
    this.router.navigate(['/login']);
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
