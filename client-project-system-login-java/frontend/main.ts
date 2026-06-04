import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { LoginComponent } from './login.component';
import { ClientManagementComponent } from './client-management.component';
import { AuthService } from './auth.service';

/** Interceptor inline para evitar erro de import */
const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  return next(req);
};

/** Definição de rotas inline para evitar erro de import */
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'clients', component: ClientManagementComponent },
  { path: '**', redirectTo: 'login' }
];

const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));