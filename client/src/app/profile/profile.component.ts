import { Component } from '@angular/core';
import { ApiComponent } from '../api/api.component';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { ThemeService } from '../theme.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  users: any[] = [];
  selectedUserId: number | null = null;
  newUser: any = {
    FirstName: '',
    LastName: '',
    Email: '',
    PasswordHash: ''
  };

  constructor(private apiComponent: ApiComponent,private authService: AuthService,  private themeService: ThemeService,) { }

  ngOnInit(): void {
    this.getUsers();
  }
  public UsersId = this.authService.getUserId();

  getUsers() {
    this.apiComponent.getUser(this.UsersId).subscribe(
      (data: any) => {
        this.users = [data];
      },
      (error) => {
        console.error('Error getting users:', error);
      }
    );
  }

  selectUser(userId: number) {
    this.selectedUserId = userId;
  }

  updateUser(userId: number) {
    const selectedUser = this.users.find(user => user.id === userId);
    if (selectedUser) {
      this.apiComponent.updateUser(userId, selectedUser).subscribe(
        () => {
          console.log('User updated successfully');
          this.selectedUserId = null;
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }

  get isDarkTheme(): boolean {
    return this.themeService.getIsDarkTheme();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}