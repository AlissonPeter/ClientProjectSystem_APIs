import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  private isBrowser: boolean;

  constructor(private router: Router,
    // 1. Injete a dependência de plataforma
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
    // 2. Defina a flag de verificação do ambiente
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  canActivate(): boolean | UrlTree {
    
   let token: string | null = null;
    
    if (this.isBrowser) {
      token = localStorage.getItem('jwtToken');
    }

    if (token) {
      // 2. Se o token existe, o usuário está logado!
      // Bloqueia o acesso à tela de login e redireciona para a Home.
      return this.router.createUrlTree(['/home']);
    } else {
      // 3. Se o token NÃO existe, permite o acesso (para que ele possa fazer login)
      return true;
    }
  }
}