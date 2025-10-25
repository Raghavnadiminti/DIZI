import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';



// 
// House Details Component Documentation
// 

/**
 * Component Purpose:
 * This component displays detailed information about a specific house fetched from the API.
 *
 * Functions:
 *
 * ngOnInit:
 *   Angular lifecycle hook used to load house details when the component is initialized.
 *
 * loadHouseDetails:
 *   Fetches detailed information about the house from the API.
 *
 * loadCharacters:
 *   The API returns character URLs; this function fetches detailed character information for display.
 *
 * forkJoin:
 *   Imported from RxJS, it allows multiple character data requests to be fetched in parallel.
 *
 * getCharacterId:
 *   Extracts the character ID from its URL, which is later used to fetch individual character details.
 *
 * goBack:
 *   Navigates the user back to the previous page.
 *
 * getDisplayValue:
 *   Formats and structures API response data for better display readability.
 *
 * retry:
 *   Retries fetching house details if the initial API request fails.
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

// Character Interface
interface Character {
  url: string;
  name: string;
  gender: string;
  culture: string;
  born: string;
  died: string;
  titles: string[];
  aliases: string[];
  father: string;
  mother: string;
  spouse: string;
  allegiances: string[];
  books: string[];
  povBooks: string[];
  tvSeries: string[];
  playedBy: string[];
}

@Component({
  selector: 'app-house-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './house-detail.component.html',
  styleUrl: './house-detail.component.css'
})
export class HouseDetailComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  house: House | null = null;
  characters: Character[] = [];
  isLoading: boolean = true;
  error: string = '';
  houseId: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.houseId = params['id'];
      this.loadHouseDetails();
    });
  }

  loadHouseDetails(): void {
    this.isLoading = true;
    this.error = '';

    // Fetch house details
    this.http.get<House>(`https://anapioficeandfire.com/api/houses/${this.houseId}`)
      .subscribe({
        next: (houseData) => {
          this.house = houseData;
          
          // If there are sworn members, fetch their details
          if (houseData.swornMembers && houseData.swornMembers.length > 0) {
            this.loadCharacters(houseData.swornMembers);
          } else {
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.error = 'Failed to load house details. Please try again later.';
          this.isLoading = false;
          console.error('Error loading house:', err);
        }
      });
  }

  loadCharacters(characterUrls: string[]): void {
    // Create an array of HTTP requests for each character
    const characterRequests = characterUrls.map(url => 
      this.http.get<Character>(url).pipe(
        catchError(err => {
          console.error('Error loading character:', err);
          return of(null);
        })
      )
    );

    // Execute all requests in parallel
    forkJoin(characterRequests).subscribe({
      next: (characters) => {
        // Filter out null values (failed requests)
        this.characters = characters.filter(char => char !== null) as Character[];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading characters:', err);
        this.isLoading = false;
      }
    });
  }

  getCharacterId(url: string): string {
    // Extract ID from URL: https://anapioficeandfire.com/api/characters/583 -> 583
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  navigateToCharacter(character: Character): void {
    const characterId = this.getCharacterId(character.url);
    this.router.navigate(['/character', characterId]);
  }

  getDisplayValue(value: string | string[], emptyText: string = 'Unknown'): string {
    if (Array.isArray(value)) {
      const filtered = value.filter(item => item && item.trim() !== '');
      return filtered.length > 0 ? filtered.join(', ') : emptyText;
    }
    return value && value.trim() !== '' ? value : emptyText;
  }

  goBack(): void {
    this.router.navigate(['/houses']);
  }

  retry(): void {
    this.loadHouseDetails();
  }
}
