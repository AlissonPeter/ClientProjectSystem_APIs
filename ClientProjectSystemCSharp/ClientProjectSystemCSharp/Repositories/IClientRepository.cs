using ClientProjectSystemCSharp.Models;

namespace ClientProjectSystemCSharp.Repositories
{
    public interface IClientRepository
    {
        void SaveOrUpdate(Client client);
        List<Client> GetAll();
        Client GetById(int? id);
        int DeleteById(int id);
    }
}
