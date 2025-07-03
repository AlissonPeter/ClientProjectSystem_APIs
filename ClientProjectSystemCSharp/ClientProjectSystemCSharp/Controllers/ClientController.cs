using ClientProjectSystemCSharp.Models;
using ClientProjectSystemCSharp.Services;
using Microsoft.AspNetCore.Mvc;

namespace ClientProjectSystemCSharp.Controllers
{
    [ApiController]
    [Route("clients")]
    public class ClientController : ControllerBase
    {
        private readonly ClientService _clientService;

        public ClientController(ClientService Clientservice)
        {
            _clientService = Clientservice;
        }

        [HttpPost]
        public IActionResult CreateClient([FromBody] Client client)
        {
            _clientService.SaveOrUpdate(client);
            return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateById(int id, [FromQuery] string name)
        {
            var client = _clientService.FindById(id);
            if (client == null)
                return NotFound();

            client.Name = name;
            _clientService.SaveOrUpdate(client);

            return NoContent(); // 204 indica que a atualização foi feita, sem corpo de resposta
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var client = _clientService.FindById(id);
            if (client == null) return NotFound();
            return Ok(client);
        }

        [HttpGet("all")]
        public ActionResult<List<Client>> FindAll()
        {
           List<Client> client = _clientService.FindAll();
            return Ok(client);
        }

        [HttpDelete("{id}")]
        public void DeleteById(int id)
        {
            _clientService.DeleteById(id);
        }
    }
}
