using ClientProjectSystemCSharp.Models;
using ClientProjectSystemCSharp.Repositories;

namespace ClientProjectSystemCSharp.Services
{
    public class ProjectService
    {
        private readonly ProjectRepository _repository;

        public ProjectService(ProjectRepository repository)
        {
            _repository = repository;
        }

        public void SaveOrUpdate(Project project)
        {
            _repository.SaveOrUpdate(project);
        }

        public List<Project> FindAll()
        {
            return _repository.GetAll();
        }

        public Project FindById(int? id)
        {
            return _repository.GetById(id);
        }

        public void Delete(Project project)
        {
            _repository.Delete(project);
        }
    }
}
