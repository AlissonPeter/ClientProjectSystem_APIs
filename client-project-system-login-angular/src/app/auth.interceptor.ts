import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtém o token do localStorage
  const token = localStorage.getItem('jwtToken');

  // 2. Cria a requisição clonada (mutável)
  let authReq = req;

  // 3. Verifica se o token existe e se a URL NÃO é a de login
  // (Você não deve enviar o token JWT para a rota de login)
  if (token && !req.url.includes('/login')) {
    
    // 4. Clona a requisição e adiciona o cabeçalho 'Authorization'
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 5. Envia a requisição clonada
  return next(authReq);
};