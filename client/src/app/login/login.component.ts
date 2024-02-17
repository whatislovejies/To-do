import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ThemeService } from '../theme.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',

})
export class LoginComponent {
  constructor(private themeService: ThemeService, private authService: AuthService) { }

  get isDarkTheme(): boolean {
    return this.themeService.getIsDarkTheme();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  public SignData = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    PasswordHash: new FormControl('', Validators.required)
  })
  // SignData = {
  //   Email: '',
  //   PasswordHash: '',
  // };

  onSubmit(): void {
    if (this.SignData.valid) {
      this.authService.login(this.SignData.get(['Email'])?.value, this.SignData.get(['PasswordHash'])?.value).subscribe(
        (response) => {
          console.log('Вход выполнен успешно:', response);
        },
        (error) => {
          if (error.status === 400) {
            console.error('Ошибка при входе:', 'Неправильные учетные данные');
          } else {
            console.error('Ошибка при входе:', error);
          }
        }
      );
    } else {
      alert('no valid')
    }
  }
}
