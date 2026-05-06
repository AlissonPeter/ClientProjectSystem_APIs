using ClientProjectSystemLoginCSharp.Models;

namespace ClientProjectSystemLoginCSharp.Services
{
    public interface ILoginService
    {
        bool ValidateCredentials(Login login);
    }
}
