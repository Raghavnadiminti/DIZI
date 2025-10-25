import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';





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
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.css'
})
export class CharacterDetailComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  character: Character | null = null;
  isLoading: boolean = true;
  error: string = '';
  characterId: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.characterId = params['id'];
      this.loadCharacterDetails();
    });
  }

  loadCharacterDetails(): void {
    this.isLoading = true;
    this.error = '';

    this.http.get<Character>(`https://anapioficeandfire.com/api/characters/${this.characterId}`)
      .subscribe({
        next: (data) => {
          this.character = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load character details. Please try again later.';
          this.isLoading = false;
          console.error('Error loading character:', err);
        }
      });
  }

  getDisplayValue(value: string | string[], emptyText: string = 'Unknown'): string {
    if (Array.isArray(value)) {
      const filtered = value.filter(item => item && item.trim() !== '');
      return filtered.length > 0 ? filtered.join(', ') : emptyText;
    }
    return value && value.trim() !== '' ? value : emptyText;
  }

  goBack(): void {
    window.history.back();
  }

  retry(): void {
    this.loadCharacterDetails();
  }
}
