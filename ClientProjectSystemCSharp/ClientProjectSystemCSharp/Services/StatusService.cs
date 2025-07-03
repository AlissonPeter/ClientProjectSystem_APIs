using ClientProjectSystemCSharp.Models;
using ClientProjectSystemCSharp.Repositories;

namespace ClientProjectSystemCSharp.Services
{
    public class StatusService
    {
        private readonly StatusRepository _repository;

        public StatusService(StatusRepository repository)
        {
            _repository = repository;
        }

        public void SaveOrUpdate(Status Status)
        {
            _repository.SaveOrUpdate(Status);
        }

        public List<Status> FindAll()
        {
            return _repository.GetAll();
        }

        public Status FindById(int? id)
        {
            return _repository.GetById(id);
        }

        public void DeleteById(int id)
        {
            _repository.DeleteById(id);
        }
    }
}
