// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { TasksComponent } from './tasks/tasks.component';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { 'path': '', component: MainComponent },
  { 'path': 'profile', component: ProfileComponent },
  { 'path': 'tasks', component: TasksComponent },
  { 'path': 'register', component: RegisterComponent },
  { 'path': 'login', component: LoginComponent },
  { 'path': '', redirectTo: '/main', pathMatch: 'full' },
  { 'path': '**', redirectTo: '/main' },
];

