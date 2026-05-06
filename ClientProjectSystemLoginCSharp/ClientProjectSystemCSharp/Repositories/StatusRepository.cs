using ClientProjectSystemLoginCSharp.Models;
using Microsoft.AspNetCore.Http;

namespace ClientProjectSystemLoginCSharp.Repositories
{
    public class StatusRepository
    {
        private readonly NHibernate.ISession _session;

        public StatusRepository(NHibernate.ISession session)
        {
            _session = session;
        }

        public void SaveOrUpdate(Status Status)
        {
            using var transaction = _session.BeginTransaction();
            _session.SaveOrUpdate(Status);
            transaction.Commit();
        }

        public List<Status> GetAll()
        {
            return _session.Query<Status>().ToList();
        }
        public Status GetById(int? id)
        {
            return _session.Get<Status>(id);
        }

        public void DeleteById(int id)
        {
            using var transaction = _session.BeginTransaction();
            _session.CreateQuery("delete from Status where Id = :id")
                    .SetParameter("id", id)
                    .ExecuteUpdate();
            transaction.Commit();
        }
    }
}
