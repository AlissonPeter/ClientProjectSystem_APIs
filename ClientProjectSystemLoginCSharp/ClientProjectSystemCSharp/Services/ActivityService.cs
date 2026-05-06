using ClientProjectSystemLoginCSharp.Models;
using ClientProjectSystemLoginCSharp.Repositories;

namespace ClientProjectSystemLoginCSharp.Services
{
    public class ActivityService
    {
        private readonly ActivityRepository _repository;

        public ActivityService(ActivityRepository repository)
        {
            _repository = repository;
        }

        public void SaveOrUpdate(List<Activity> activity)
        {
            _repository.SaveOrUpdate(activity);
        }

        public Activity FindById(int? id)
        {
            return _repository.GetById(id);
        }

        public void DeleteByProjectId(int? projectId)
        {
            _repository.DeleteByProjectId(projectId);
        }
    }
}
