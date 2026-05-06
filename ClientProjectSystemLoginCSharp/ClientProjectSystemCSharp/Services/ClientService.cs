using ClientProjectSystemLoginCSharp.Models;
using ClientProjectSystemLoginCSharp.Repositories;

namespace ClientProjectSystemLoginCSharp.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _clientRepository;

        public ClientService(IClientRepository ClientRepository)
        {
            _clientRepository = ClientRepository;
        }

        public void SaveOrUpdate(Client client)
        {
            _clientRepository.SaveOrUpdate(client);
        }

        public List<Client> FindAll()
        {
            return _clientRepository.GetAll();
        }

        public Client FindById(int? id)
        {
            try
            {
                return _clientRepository.GetById(id);
            }
            catch (NHibernate.ObjectNotFoundException)
            {
                // Traduz a exceção de NHibernate para uma exceção de negócio
                throw new InvalidOperationException($"Client with ID {id} not found.");
            }
        }

        public int DeleteById(int id)
        {
            var affectedRows = _clientRepository.DeleteById(id);
            // Se o número de linhas afetadas for 0, o cliente não existia.
            if (affectedRows == 0)
            {
                throw new InvalidOperationException($"Client with ID {id} not found.");
            }
            return affectedRows;
        }
    }
}
