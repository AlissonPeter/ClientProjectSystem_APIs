using ClientProjectSystemCSharp.Models;
using ClientProjectSystemCSharp.Services;
using Microsoft.AspNetCore.Mvc;

namespace ClientProjectSystemCSharp.Controllers
{
    [ApiController]
    [Route("projects")]
    public class ProjectController : ControllerBase
    {
        private readonly ProjectService _projectService;
        private readonly StatusService _statusService;
        private readonly ClientService _clientService;
        private readonly ActivityService _activityService;

        public ProjectController(ProjectService Projectservice, StatusService statusService, 
            ClientService clientService, ActivityService activityService)
        {
            _projectService = Projectservice;
            _statusService = statusService;
            _clientService = clientService;
            _activityService = activityService;
        }

        [HttpPost]
        public IActionResult CreateProject([FromBody] Project project)
        {
            project.Status = _statusService.FindById(project.Status.Id);
            project.Client = _clientService.FindById(project.Client.Id);
            foreach (var activity in project.Activities)
            {
                activity.Project = project; 
            }
            _projectService.SaveOrUpdate(project);
            return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
        }

        [HttpPut]
        public IActionResult UpdateById([FromBody] Project projectUpdated)
        {
            var project = _projectService.FindById(projectUpdated.Id);
            if (project == null)
                return NotFound();
            project.Description = projectUpdated.Description;
            project.Client = projectUpdated.Client;
            project.Status = projectUpdated.Status;
            project.Activities.Clear();
            foreach (var activity in projectUpdated.Activities)
            {
                activity.Id = null;
                activity.Project = project;
                project.Activities.Add(activity);
            }
            //_activityService.DeleteByProjectId(project.Id);
            _projectService.SaveOrUpdate(project);

            return NoContent(); // 204 indica que a atualização foi feita, sem corpo de resposta
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var project = _projectService.FindById(id);
            if (project == null) return NotFound();
            return Ok(project);
        }

        [HttpGet("all")]
        public ActionResult<List<Project>> FindAll()
        {
           List<Project> Project = _projectService.FindAll();
            return Ok(Project);
        }

        [HttpDelete("{id}")]
        public void DeleteById(int id)
        {
            var project = _projectService.FindById(id);
            _projectService.Delete(project);
        }
    }
}
