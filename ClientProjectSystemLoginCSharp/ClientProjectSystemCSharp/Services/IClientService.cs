using ClientProjectSystemLoginCSharp.Models;
using ClientProjectSystemLoginCSharp.Repositories;

namespace ClientProjectSystemLoginCSharp.Services
{
    public interface IClientService
    {
        void SaveOrUpdate(Client client);

        List<Client> FindAll();

        Client FindById(int? id);

        int DeleteById(int id);
    }
}
