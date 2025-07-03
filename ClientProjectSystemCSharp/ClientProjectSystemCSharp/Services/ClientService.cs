using ClientProjectSystemCSharp.Models;
using ClientProjectSystemCSharp.Repositories;

namespace ClientProjectSystemCSharp.Services
{
    public class ClientService
    {
        private readonly ClientRepository _repository;

        public ClientService(ClientRepository repository)
        {
            _repository = repository;
        }

        public void SaveOrUpdate(Client client)
        {
            _repository.SaveOrUpdate(client);
        }

        public List<Client> FindAll()
        {
            return _repository.GetAll();
        }

        public Client FindById(int? id)
        {
            return _repository.GetById(id);
        }

        public void DeleteById(int id)
        {
            _repository.DeleteById(id);
        }
    }
}
