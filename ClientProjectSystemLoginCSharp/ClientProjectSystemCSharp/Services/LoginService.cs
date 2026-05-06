using ClientProjectSystemLoginCSharp.Models;
using ClientProjectSystemLoginCSharp.Repositories;

namespace ClientProjectSystemLoginCSharp.Services
{
    public class LoginService : ILoginService
    {
        private LoginRepository _loginRepository;
        
        public LoginService (LoginRepository loginRepository)
        {
            _loginRepository = loginRepository;
        }

        public bool ValidateCredentials(Login login)
        {
            try
            {
                List<Login> loginDb = _loginRepository.LoadByUsernamePassword(login.Username, login.Password);

                if (loginDb.Count == 0)
                {
                    throw new Exception("Login e Senha inválidos.");
                }
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao buscar o login no banco de dados.", ex);
            }
        }
    }
}
