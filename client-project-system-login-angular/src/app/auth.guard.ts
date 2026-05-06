import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private isBrowser: boolean;

  constructor(private router: Router,
    // 1. Injeta o token de identificação da plataforma
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  canActivate(): boolean | UrlTree {

    let token: string | null = null;
    //Acessa localStorage se estiver no navegador
    if (this.isBrowser) {
      //Recebe o token do login
      token = localStorage.getItem('jwtToken');
    }
    if (token) {
      // Se o token existe, permite o acesso à rota
      return true;
    } else {
      if (this.isBrowser) {
        alert("Você precisa estar logado para acessar esta página.");
      }
      //Se o token NÃO existe, redireciona para a rota de login
      return this.router.createUrlTree(['/login']);
    }
  }
}