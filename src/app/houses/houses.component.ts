import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';



// 
// Houses Component Documentation
// 

/**
 * Component Purpose:
 * This component renders a list of all houses fetched from the API.
 *
 * Functions:
 *
 * ngOnInit:
 *   Angular lifecycle hook used to load house data when the component is initialized.
 *
 * loadHouses:
 *   Fetches the list of houses from the API.
 *
 * getHouseId:
 *   Extracts the unique ID of a house from its API URL, which is later used to fetch
 *   house-specific details.
 *
 * navigateToHouse:
 *   Navigates to the `/houses/:id` route to display detailed information about a specific house.
 *
 * getDisplaySeats:
 *   Processes the API response to present seat information in a readable format.
 *
 * getDisplayWords:
 *   Formats and structures motto or words data from the API for easier display.
 */


// House Interface based on API documentation
interface House {
  url: string;
  name: string;
  region: string;
  coatOfArms: string;
  words: string;
  titles: string[];
  seats: string[];
  currentLord: string;
  heir: string;
  overlord: string;
  founded: string;
  founder: string;
  diedOut: string;
  ancestralWeapons: string[];
  cadetBranches: string[];
  swornMembers: string[];
}

@Component({
  selector: 'app-houses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './houses.component.html',
  styleUrl: './houses.component.css'
})

export class HousesComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  houses: House[] = [];
  isLoading: boolean = true;
  error: string = '';

  ngOnInit(): void {
    this.loadHouses();
  }

  loadHouses(): void {
    this.isLoading = true;
    this.error = '';
    
    // Fetch first page with 50 houses
    this.http.get<House[]>('https://anapioficeandfire.com/api/houses?page=1&pageSize=50')
      .subscribe({
        next: (data) => {
          this.houses = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load houses. Please try again later.';
          this.isLoading = false;
          console.error('Error loading houses:', err);
        }
      });
  }

  getHouseId(url: string): string {
    // Extract ID from URL: https://anapioficeandfire.com/api/houses/362 -> 362
    const parts = url.split('/');
    console.log("ewewewe",parts[parts.length - 1])
    return parts[parts.length - 1];
  }

  navigateToHouse(house: House): void {
    const houseId = this.getHouseId(house.url);
    // Fixed navigation route to use /houses/:id as requested
    this.router.navigate(['/houses', houseId]);
  }

  getDisplaySeats(seats: string[]): string {
    return seats.filter(seat => seat && seat.trim() !== '').join(', ') || 'Unknown';
  }

  getDisplayWords(words: string): string {
    return words && words.trim() !== '' ? words : 'No words';
  }
}