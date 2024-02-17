import { Component, VERSION, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Board } from '../models/board.model';
import { Column } from '../models/column.model';
import { CommonModule } from '@angular/common'; 
import { ApiComponent } from '../api/api.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Theme } from '../models/theme.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Task } from '../models/task.model';
import { ThemeService } from '../theme.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [DragDropModule, CommonModule, FormsModule,MatIconModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  public originalColumnName: string = '';
  public editMode = false;
  isDialogOpen = false;
  constructor(private authService: AuthService, private ApiComponent: ApiComponent, private themeService: ThemeService, private dialog: MatDialog) {}

  public board: Board = new Board('Test Board', []);
  public themes: Theme[] = [];

  ThemeData = {
    Name: "",
    UsersId: this.authService.getUserId()
  };

  ngOnInit(): void {
    this.refreshBoard();
  }

  private refreshBoard(): void {
    this.ApiComponent.getTheme(this.ThemeData.UsersId).subscribe(
      (themes: Theme[]) => {
        this.themes = themes; 
        this.board.columns = [];
        themes.forEach((theme: Theme) => {
          this.ApiComponent.getTask(theme.id).subscribe(
            (tasks: Task[]) => {
              const newColumn = new Column(theme.name, theme.id.toString(), tasks);
              this.board.columns.push(newColumn);
            },
            (error) => {
              const newColumn = new Column(theme.name, theme.id.toString(), []);
              this.board.columns.push(newColumn);
            }
          );
        });
      },
      (error) => {
        console.error('Ошибка при получении тем:', error);
      }
    );
  }

  public dropGrid(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.board.columns, event.previousIndex, event.currentIndex);
  }

  public drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  public createTheme(): void {
    this.ApiComponent.createTheme(this.ThemeData).subscribe(
      (response) => {
        console.log('Успешно создана:', response);
        this.refreshBoard();
        // Очистка поля ввода после успешного создания темы
        this.ThemeData.Name = "";
      },
      (error) => {
        console.error('Ошибка при отправке данных:', error);
        console.error(this.ThemeData);
  });
  }

  get isDarkTheme(): boolean {
    return this.themeService.getIsDarkTheme();
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  public openDialog(themeId: string): void {
    if (!this.isDialogOpen) {
      this.isDialogOpen = true; 
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = '500px';
      dialogConfig.height = '400px';
    
      const dialogRef = this.dialog.open(TaskDialogComponent, {
        ...dialogConfig,
      });
    
      dialogRef.afterClosed().subscribe(result => {
        this.isDialogOpen = false; 

        if (result) {
          this.ApiComponent.createTask({
            Title: result.Title,
            IsCompleted: result.IsCompleted,
            UsersId: this.authService.getUserId(),
            ThemeTaskId: themeId,
            Description: result.Description
          }).subscribe(
            (response) => {
              console.log('Task created successfully:', response);
              this.refreshBoard();
            },
            (error) => {
              console.error('Error creating task:', error);
            }
          );
        } else {
          console.log('Dialog closed without data');
        }
      });
    }
  }
  

  

  public editTask(themeId: string, task: Task): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.height = '400px';
  
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      ...dialogConfig,
      data: {
        id: task.id,
        Title: task.title,
        IsCompleted: task.isCompleted,
        UsersId: this.authService.getUserId(),
        ThemeTaskId: task.ThemeTaskId,
        Description: task.description
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ApiComponent.updateTask(task.id, {
          id: task.id,
          Title: result.Title,
          IsCompleted: result.IsCompleted,
          UsersId: this.authService.getUserId(),
          ThemeTaskId: themeId,
          Description: result.Description
        }).subscribe(
          (response) => {
            console.log('Task updated successfully:', response);
            this.refreshBoard();
          },
          (error) => {
            console.error('Error updating task:', error);
          }
        );
      } else {
        console.log('Dialog closed without data');
      }
    });
  }

  public openDeleteDialogTask(columnId: string, task: Task): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ApiComponent.deleteTask(task.id).subscribe(
          (response) => {
            console.log('Task deleted successfully:', response);
            this.refreshBoard();
          },
          (error) => {
            console.error('Error deleting task:', error);
          }
        );
      }
    });
  }


  public openDeleteDialogTheme(columnId: number, column: Column): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ApiComponent.deleteTheme(columnId).subscribe(
          (response) => {
            console.log('Task deleted successfully:', response);
            this.refreshBoard();
          },
          (error) => {
            console.error('Error deleting task:', error);
          }
        );
      }
    });
  }


  public toggleEditMode(column: Column): void {
    if (!column.editMode) {
      // Сохраните оригинальное название перед входом в режим редактирования
      this.originalColumnName = column.name;
    } else {
   
      column.name = this.originalColumnName;
    }
    column.editMode = !column.editMode;
  }

  public saveColumnName(themeId: number, column: Column): void {
    this.ApiComponent.updateTheme(themeId, {
      id: themeId,
      Name: column.name,
      UsersId: this.authService.getUserId(),
    }).subscribe(
      (response) => {
        console.log('Theme updated successfully:', response);
        this.refreshBoard();
      },
      (error) => {
        console.error('Error updating theme:', error);
      }
    );
    column.editMode = false;
  }

  public enterThemeEditMode(column: Column): void {
    column.editMode = true;
  }
  
  public exitThemeEditMode(column: Column): void {
    column.editMode = false;
  }

  
}