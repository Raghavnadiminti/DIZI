import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HousesComponent} from'./houses/houses.component'

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet,HousesComponent],
  template: '<div><app-houses></app-houses></div>',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dizitask';
}
