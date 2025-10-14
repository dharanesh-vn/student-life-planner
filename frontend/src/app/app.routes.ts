import { inject } from '@angular/core';
import { Routes, Router, UrlTree } from '@angular/router';
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
import { FinanceDashboardComponent } from './components/finance/finance-dashboard/finance-dashboard.component';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';

const authGuard = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/');
};

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'ai-assistant', component: AiAssistantComponent },
      { path: 'academic/assignments', component: AssignmentTrackerComponent },
      { path: 'academic/classes', component: ClassManagementComponent },
      { path: 'academic/pomodoro', component: PomodoroTimerComponent },
      { path: 'academic/courses/:courseId/notes', component: NotesComponent },
      { path: 'planning/planner', component: PlannerComponent },
      { path: 'planning/goals', component: GoalsComponent },
      { path: 'finance', component: FinanceDashboardComponent },
      { path: 'dashboard', redirectTo: '/academic/assignments', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];