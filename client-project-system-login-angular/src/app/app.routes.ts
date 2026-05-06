import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { LoggedInGuard } from './logged-in.guard';

export const routes: Routes = [
     // Rota da Home que está funcionando internamente
    { 
        path: 'home', 
        component: HomeComponent, 
        canActivate: [AuthGuard] 
    }, 
    
    // Rota de Login
    { 
        path: 'login', 
        component: LoginComponent ,
        canActivate: [LoggedInGuard]
    }, 
    
    //Redirecionamento da raiz para Login
    { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    }, 
];
