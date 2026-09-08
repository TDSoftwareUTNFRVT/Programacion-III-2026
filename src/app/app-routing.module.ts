import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { AgendaDiaComponent } from './components/agenda-dia/agenda-dia.component';
import { AltaTurnoComponent } from './components/alta-turno/alta-turno.component';
import { FichaPacienteComponent } from './components/ficha-paciente/ficha-paciente.component';
import { PresentationComponent } from './components/presentation/presentation.component';
import { HiddenComponent } from './components/hidden/hidden.component';

const routes: Routes = [
  {path: '', component: PresentationComponent},
  {path: 'hidden', component: HiddenComponent},
  {path: 'e1', component: HeroComponent},
  {path: 'e2', component: AgendaDiaComponent},
  {path: 'e3', component: AltaTurnoComponent},
  {path: 'e4', component: FichaPacienteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
