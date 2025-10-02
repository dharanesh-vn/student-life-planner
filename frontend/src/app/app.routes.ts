import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

// Import Layouts
import { HomeComponent } from './components/home/home.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

// Import Pages
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ClassManagementComponent } from './components/academic/class-management/class-management.component';
import { AssignmentTrackerComponent } from './components/academic/assignment-tracker/assignment-tracker.component';
import { PomodoroTimerComponent } from './components/academic/pomodoro-timer/pomodoro-timer.component';
import { NotesComponent } from './components/academic/notes/notes.component';
import { PlannerComponent } from './components/planning/planner/planner.component';
import { GoalsComponent } from './components/planning/goals/goals.component';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/']); // Redirect to the Home/Login page
    return false;
  }
};

export const routes: Routes = [
  // CORRECTED: Unprotected routes for the authentication layout
  { 
    path: '', 
    component: HomeComponent,
    // These are child routes that will be rendered inside HomeComponent's <router-outlet>
    children: [
      { path: '', component: LoginComponent }, // The default path '' shows the Login form
      { path: 'register', component: RegisterComponent } // The path '/register' shows the Register form
    ]
  },
  
  // Protected routes that use the Dashboard Layout
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'academic/assignments', component: AssignmentTrackerComponent },
      { path: 'academic/classes', component: ClassManagementComponent },
      { path: 'academic/pomodoro', component: PomodoroTimerComponent },
      { path: 'academic/courses/:courseId/notes', component: NotesComponent },
      { path: 'planning/planner', component: PlannerComponent },
      { path: 'planning/goals', component: GoalsComponent },
      // Add a default dashboard route
      { path: 'dashboard', redirectTo: '/academic/assignments', pathMatch: 'full' },
    ]
  },

  // A final wildcard route to catch any undefined URLs
  { path: '**', redirectTo: '', pathMatch: 'full' }
];