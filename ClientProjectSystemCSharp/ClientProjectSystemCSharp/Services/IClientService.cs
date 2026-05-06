using ClientProjectSystemCSharp.Models;
using ClientProjectSystemCSharp.Repositories;

namespace ClientProjectSystemCSharp.Services
{
    public interface IClientService
    {
        void SaveOrUpdate(Client client);

        List<Client> FindAll();

        Client FindById(int? id);

        int DeleteById(int id);
    }
}
