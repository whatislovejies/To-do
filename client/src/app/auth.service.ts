import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInVar = false;
  private userId: number | null = null;


  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // При загрузке приложения проверяем данные в localStorage
    if (isPlatformBrowser(this.platformId)) {

      const storedUserId = localStorage.getItem('userId');
      const storedIsLoggedInVar = localStorage.getItem('isLoggedInVar');

      if ( storedUserId && storedIsLoggedInVar) {

        this.userId = +storedUserId;
        this.isLoggedInVar = storedIsLoggedInVar === 'true';
      }
    }
  }

  isLoggedIn(): boolean {
    return this.isLoggedInVar;
  }

  getUserId(): number | null {
    return this.userId;
  }

  login(email: string, password: string): Observable<any> {
    const loginData = { Email: email, PasswordHash: password };

    return this.http.post<any>('http://localhost:5000/api/Users/login', loginData).pipe(
      tap((response: any) => {
        if (response && response.success) {
          console.log('Вход выполнен успешно', response);

          this.isLoggedInVar = true;
          this.userId = response.userId;

          // Сохраняем данные в localStorage
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('userId', (this.userId ?? '').toString());
            localStorage.setItem('isLoggedInVar', 'true');
          }

          this.router.navigate(['/']);
        } else {
          console.error('Ошибка входа: ', response);
        }
      })
    );
  }

  logout(): void {
    this.isLoggedInVar = false;
    this.userId = null;
 
    // Очищаем данные в localStorage при выходе
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userId');
      localStorage.removeItem('isLoggedInVar');
    }

    this.router.navigate(['/login']);
  }
}
