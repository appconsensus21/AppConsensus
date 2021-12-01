import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplayoutAdminComponent } from './layouts/applayout-admin/applayout-admin.component';
import { ApplayoutModComponent } from './layouts/applayout-mod/applayout-mod.component';
import { ApplayoutPartComponent } from './layouts/applayout-part/applayout-part.component';
import { CalificacionProcesoComponent } from './modules/participante/calificacion-proceso/page/calificacion-proceso.component';
import { EvaluacionProcesoComponent } from './modules/participante/evaluacion-proceso/page/evaluacion-proceso.component';
import { ListaProcesosComponent } from './modules/participante/lista-procesos/page/lista-procesos.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { GuardComponent } from './guards/guard.component';
import { GuardModeradorComponent } from './guards/guardModerador.component';
import { GuardParticipanteComponent } from './guards/guardParticipante.component';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadChildren: () => import('./modules/auth/sign-in/sign-in.module').then(m => m.SignInModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./modules/auth/sign-up/sign-up.module').then(m => m.SignUpModule)
  },
  {
    path: 'appAdmin',
    component: ApplayoutAdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        canActivate: [AngularFireAuthGuard,GuardComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/administrador/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'consensos',
        canActivate: [AngularFireAuthGuard,GuardComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/administrador/consensos/consensos.module').then(m => m.ConsensosModule)
      },
      {
        path: 'moderadores',
        canActivate: [AngularFireAuthGuard,GuardComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/administrador/moderadores/moderadores.module').then(m => m.ModeradoresModule)
      },
      {
        path: 'enviarnotificacion',
        canActivate: [AngularFireAuthGuard,GuardComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/administrador/notificaciones/notificaciones.module').then(m => m.NotificacionesModule)
      },
    ]
  },
  {
    path: 'appModerador',
    component: ApplayoutModComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        //: [AuthGuard],
        canActivate: [AngularFireAuthGuard, GuardModeradorComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/moderador/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'consensos',
        canActivate: [AngularFireAuthGuard, GuardModeradorComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/moderador/consensos-moderador/consensos-moderador.module').then(m => m.ConsensosModeradorModule)
      },
      {
        path: 'nuevoconsenso',
        canActivate: [AngularFireAuthGuard, GuardModeradorComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/moderador/nuevo-consenso/nuevo-consenso.module').then(m => m.NuevoConsensoModule)
      },
      {
        path: 'configconsenso/:consensoId',
        canActivate: [AngularFireAuthGuard, GuardModeradorComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/moderador/configurar-consenso/configurar-consenso.module').then(m => m.ConfigurarConsensoModule)
      },
    ]
  },
  {
    path: 'appParticipante',
    component: ApplayoutPartComponent,
    children: [
      {
        path: '',
        redirectTo: 'listaConsensos',
        pathMatch: 'full'
      },
      {
        path: 'listaConsensos',
        component: ListaProcesosComponent,
        canActivate: [AngularFireAuthGuard, GuardParticipanteComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/participante/lista-procesos/lista-procesos.module').then(m => m.ListaProcesosModule)
      },
      {
        path: 'evaluacionProceso/:consensoId',
        component: EvaluacionProcesoComponent,
        canActivate: [AngularFireAuthGuard,GuardParticipanteComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/participante/evaluacion-proceso/evaluacion-proceso.module').then(m => m.EvaluacionProcesoModule)
      },
      {
        path: 'calificacionProceso/:rondaId',
        component: CalificacionProcesoComponent,
        canActivate: [AngularFireAuthGuard, GuardParticipanteComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/participante/calificacion-proceso/calificacion-proceso.module').then(m => m.CalificacionProcesoModule)
      },
      {
        path: 'resultados/:consensoId',
        canActivate: [AngularFireAuthGuard, GuardParticipanteComponent],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () => import('./modules/participante/resultados/resultados.module').then(m => m.ResultadosModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
