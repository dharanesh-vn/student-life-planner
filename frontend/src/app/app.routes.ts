import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

// Import Layout Components
import { HomeComponent } from './components/home/home.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

// Import All Page Components
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ClassManagementComponent } from './components/academic/class-management/class-management.component';
import { AssignmentTrackerComponent } from './components/academic/assignment-tracker/assignment-tracker.component';
import { PomodoroTimerComponent } from './components/academic/pomodoro-timer/pomodoro-timer.component';
import { NotesComponent } from './components/academic/notes/notes.component';
import { PlannerComponent } from './components/planning/planner/planner.component';
import { GoalsComponent } from './components/planning/goals/goals.component';
import { FinanceDashboardComponent } from './components/finance/finance-dashboard/finance-dashboard.component';

// Auth Guard to protect dashboard routes
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true; // Allow access if the user is logged in
  } else {
    router.navigate(['/']); // Redirect to the Home/Login page if not logged in
    return false;
  }
};

export const routes: Routes = [
  // == UNAUTHENTICATED LAYOUT ==
  // The root path '/' uses the HomeComponent as its layout.
  // Login and Register will be rendered inside HomeComponent's <router-outlet>.
  { 
    path: '', 
    component: HomeComponent,
    children: [
      { path: '', component: LoginComponent }, // Default view is Login
      { path: 'register', component: RegisterComponent }
    ]
  },
  
  // == AUTHENTICATED DASHBOARD LAYOUT ==
  // All protected routes are children of the DashboardLayoutComponent.
  // This ensures the sidebar is always present on these pages.
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard], // This entire group is protected
    children: [
      { path: 'academic/assignments', component: AssignmentTrackerComponent },
      { path: 'academic/classes', component: ClassManagementComponent },
      { path: 'academic/pomodoro', component: PomodoroTimerComponent },
      { path: 'academic/courses/:courseId/notes', component: NotesComponent },
      
      { path: 'planning/planner', component: PlannerComponent },
      { path: 'planning/goals', component: GoalsComponent },
      
      { path: 'finance', component: FinanceDashboardComponent },

      // A default redirect for the dashboard root
      { path: 'dashboard', redirectTo: '/academic/assignments', pathMatch: 'full' },
    ]
  },

  // Wildcard route to catch any undefined URLs and redirect to the home page
  { path: '**', redirectTo: '', pathMatch: 'full' }
];