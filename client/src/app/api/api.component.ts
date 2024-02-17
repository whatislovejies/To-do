import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiComponent {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createTheme(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ThemeTasks/`, data).pipe(
      catchError((error) => {
        console.error('Error creating theme:', error);
        return throwError(error);
      })
    );
  }

  createTask(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Tasks`, data).pipe(
      catchError((error) => {
        console.error('Error creating task:', error);
        return throwError(error);
      })
    );
  }

  getTheme(userId: number | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ThemeTasks/get/${userId}`).pipe(
      catchError((error) => {
        console.error('Error getting themes:', error);
        return throwError(error);
      })
    );
  }


  updateTheme(ThemeId: number | null,data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(`${this.apiUrl}/ThemeTasks/${ThemeId}`,data).pipe( 
      catchError((error) => {
        console.error('Error getting tasks:', error);
        return throwError(error);
      })
    )
  }


  getTask(ThemeId: number | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Tasks/get/${ThemeId}`).pipe(

    );
  }

  updateTask(TaskId: number | null,data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(`${this.apiUrl}/Tasks/${TaskId}`,data).pipe(
      catchError((error) => {
        console.error('Error getting tasks:', error);
        return throwError(error);
      })
    )
  }

deleteTask(TaskId: number | null): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/Tasks/${TaskId}`).pipe(
    catchError((error) => {
      console.error('Error delete tasks:', error);
      return throwError(error);
    })
  )
}
deleteTheme(ThemeId: number | null): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/ThemeTasks/${ThemeId}`).pipe(
    catchError((error) => {
      console.error('Error delete theme:', error);
      return throwError(error);
    })
  )
}
  getSomeData(userId: number | null): Observable<any> {
    if (userId !== null) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getUserId()}`);
      return this.http.get<any>(`${this.apiUrl}/Tasks/get/`, { headers }).pipe(
        catchError((error) => {
          console.error('Error getting some data:', error);
          return throwError(error);
        })
      );
    } else {
      return new Observable();
    }
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Users/register`, data).pipe(
      catchError((error) => {
        console.error('Error posting data:', error);
        return throwError(error);
      })
    );
  }

  getUser(id: number|null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Users/${id}`).pipe(
      catchError((error) => {
        console.error('Error posting data:', error);
        return throwError(error);
      })
    );
  }
  updateUser(id: number,data:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Users/${id}`,data).pipe(
      catchError((error) => {
        console.error('Error posting data:', error);
        return throwError(error);
      })
    );
  }
}
