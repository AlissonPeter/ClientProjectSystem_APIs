using ClientProjectSystemLoginCSharp.Models;
using ClientProjectSystemLoginCSharp.Services;
using Microsoft.AspNetCore.Mvc;

namespace StatusProjectSystemCSharp.Controllers
{
    [ApiController]
    [Route("status")]
    public class StatusController : ControllerBase
    {
        private readonly StatusService _StatusService;

        public StatusController(StatusService Statusservice)
        {
            _StatusService = Statusservice;
        }

        [HttpPost]
        public IActionResult CreateStatus([FromBody] Status Status)
        {
            _StatusService.SaveOrUpdate(Status);
            return CreatedAtAction(nameof(GetById), new { id = Status.Id }, Status);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateById(int id, [FromQuery] string description, [FromQuery] int kind)
        {
            var Status = _StatusService.FindById(id);
            if (Status == null)
                return NotFound();

            Status.Description = description;
            Status.Kind = kind;
            _StatusService.SaveOrUpdate(Status);

            return NoContent(); // 204 indica que a atualização foi feita, sem corpo de resposta
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var Status = _StatusService.FindById(id);
            if (Status == null) return NotFound();
            return Ok(Status);
        }

        [HttpGet("all")]
        public ActionResult<List<Status>> FindAll()
        {
            List<Status> Status = _StatusService.FindAll();
            return Ok(Status);
        }

        [HttpDelete("{id}")]
        public void DeleteById(int id)
        {
            _StatusService.DeleteById(id);
        }
    }
}
