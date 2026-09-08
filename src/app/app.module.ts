import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroComponent } from './components/hero/hero.component';
import { ModalComponent } from './components/modal/modal.component';
import { TurnoCardComponent } from './components/turno-card/turno-card.component';
import { AgendaDiaComponent } from './components/agenda-dia/agenda-dia.component';
import { AltaTurnoComponent } from './components/alta-turno/alta-turno.component';
import { WizardComponent } from './components/wizard/wizard.component';
import { PanelColapsableComponent } from './components/panel-colapsable/panel-colapsable.component';
import { FichaPacienteComponent } from './components/ficha-paciente/ficha-paciente.component';
import { MenuPracticoComponent } from './components/menu-practico/menu-practico.component';
import { RouterLink } from '@angular/router';
import { PresentationComponent } from './components/presentation/presentation.component';
import { HiddenComponent } from './components/hidden/hidden.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroComponent,
    ModalComponent,
    TurnoCardComponent,
    AgendaDiaComponent,
    AltaTurnoComponent,
    WizardComponent,
    PanelColapsableComponent,
    FichaPacienteComponent,
    MenuPracticoComponent,
    PresentationComponent,
    HiddenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterLink
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
