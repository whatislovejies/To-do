import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkTheme = false;

  getIsDarkTheme(): boolean {
    return this.isDarkTheme;
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
  }
}
