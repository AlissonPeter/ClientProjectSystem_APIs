using ClientProjectSystemLoginCSharp.Models;
using Microsoft.AspNetCore.Http;

namespace ClientProjectSystemLoginCSharp.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly NHibernate.ISession _session;

        public ClientRepository(NHibernate.ISession session)
        {
            _session = session;
        }

        public void SaveOrUpdate(Client client)
        {
            using var transaction = _session.BeginTransaction();
            _session.SaveOrUpdate(client);
            transaction.Commit();
        }

        public List<Client> GetAll()
        {
            return _session.Query<Client>().ToList();
        }
        public Client GetById(int? id)
        {
            return _session.Get<Client>(id);
        }

        public int DeleteById(int id)
        {
            using var transaction = _session.BeginTransaction();
            var affectedRows = _session.CreateQuery("delete from Client where Id = :id")
                    .SetParameter("id", id)
                    .ExecuteUpdate();
            transaction.Commit();
            return affectedRows;
        }
    }
}
