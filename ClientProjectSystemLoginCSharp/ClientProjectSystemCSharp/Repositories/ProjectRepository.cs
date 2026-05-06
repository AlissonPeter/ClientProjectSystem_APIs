using ClientProjectSystemLoginCSharp.Models;
using Microsoft.AspNetCore.Http;

namespace ClientProjectSystemLoginCSharp.Repositories
{
    public class ProjectRepository
    {
        private readonly NHibernate.ISession _session;

        public ProjectRepository(NHibernate.ISession session)
        {
            _session = session;
        }

        public void SaveOrUpdate(Project project)
        {
            using var transaction = _session.BeginTransaction();
            _session.SaveOrUpdate(project);
            transaction.Commit();
        }

        public List<Project> GetAll()
        {
            return _session.Query<Project>().ToList();
        }
        public Project GetById(int? id)
        {
            return _session.Get<Project>(id);
        }

        public void Delete(Project project)
        {
            _session.Delete(project);
            _session.Flush();
        }
    }
}
