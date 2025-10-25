import { Routes } from '@angular/router';
import { HousesComponent } from './houses/houses.component';


export const routes: Routes = [
  { path: '', redirectTo: '/houses', pathMatch: 'full' },
  { path: 'houses', component: HousesComponent },

];
