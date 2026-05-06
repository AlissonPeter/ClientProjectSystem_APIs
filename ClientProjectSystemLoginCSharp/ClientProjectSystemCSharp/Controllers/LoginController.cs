using ClientProjectSystemLoginCSharp.Models;
using ClientProjectSystemLoginCSharp.Services;
using FluentNHibernate.Conventions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace ClientProjectSystemLoginCSharp.Controllers
{
    public class LoginController : ControllerBase
    {
        // 🔓 Rota Pública: Não precisa de token
        private readonly ITokenService _tokenService;
        private readonly ILoginService _loginService;

        public LoginController(ITokenService tokenService, ILoginService loginService)
        {
            _tokenService = tokenService;
            _loginService = loginService;
        }

        [HttpPost("login")]
        [AllowAnonymous] //Deixa claro que é pública
        // 🔑 Mude o tipo de retorno aqui para que o retorno seja uma string
        public IActionResult Login([FromBody] Login login)
        {
            bool loginValid = _loginService.ValidateCredentials(login);
            if (loginValid)
            {
                // Geração e Retorno do Token (Apenas a string)
                var tokenString = _tokenService.GenerateToken(login.Username);
                if (!string.IsNullOrWhiteSpace(tokenString))
                {
                    // Retorna o token como uma string simples dentro do corpo HTTP 200 OK.
                    return Ok(tokenString);
                }
            }
            // Retorna acesso inválido, status HTTP 401
            return Unauthorized(new { Message = "Credenciais inválidas." });
        }
    }
}
