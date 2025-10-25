import { Routes } from '@angular/router';
import { HousesComponent } from './houses/houses.component';
import { HouseDetailComponent } from './singlehouse/house-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/houses', pathMatch: 'full' },
  { path: 'houses', component: HousesComponent },
{ path: 'houses/:id', component: HouseDetailComponent },

];
