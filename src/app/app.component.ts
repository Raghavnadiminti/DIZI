import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HousesComponent} from'./houses/houses.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: '<div>,app-houses></app-houses></div>',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dizitask';
}
