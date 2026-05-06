using ClientProjectSystemCSharp.Models;
using Microsoft.AspNetCore.Http;

namespace ClientProjectSystemCSharp.Repositories
{
    public class ActivityRepository
    {
        private readonly NHibernate.ISession _session;

        public ActivityRepository(NHibernate.ISession session)
        {
            _session = session;
        }

        public void SaveOrUpdate(List<Activity> activities)
        {
            using var transaction = _session.BeginTransaction();
            foreach (var activity in activities)
            {
                _session.SaveOrUpdate(activity);
            }
            transaction.Commit();
        }

        /*public List<Activity> GetByProjectId(int projectId)
        {
            using var transaction = _session.BeginTransaction();
            var activities = _session.CreateQuery("from Activity where Project.Id = :projectId")
                              .SetParameter("projectId", projectId)
                              .List<Activity>() 
                              .ToList();         // converter para List<Activity>
            transaction.Commit();
            return activities;
        }*/

        public Activity GetById(int? id)
        {
            return _session.Get<Activity>(id);
        }

        public void DeleteByProjectId(int? projectId)
        {
            using var transaction = _session.BeginTransaction();
            _session.CreateQuery("delete from Activity where ProjectId = :projectId")
                    .SetParameter("projectId", projectId)
                    .ExecuteUpdate();
            //_session.Clear();  // <- Limpa o cache de 1º nível da session!
            transaction.Commit();
        }
    }
}
