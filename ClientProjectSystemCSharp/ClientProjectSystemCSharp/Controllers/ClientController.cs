using ClientProjectSystemCSharp.Models;
using ClientProjectSystemCSharp.Services;
using Microsoft.AspNetCore.Mvc;

namespace ClientProjectSystemCSharp.Controllers
{
    [ApiController]
    [Route("clients")]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientController(IClientService service)
        {
            _clientService = service;
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
            try
            {
                var client = _clientService.FindById(id);
                return Ok(client);
            }
            catch (InvalidOperationException ex)
            {
                // O controller captura a exceção e a mapeia para um NotFound
                return NotFound(ex.Message);
            }
        }

        [HttpGet("all")]
        public ActionResult<List<Client>> FindAll()
        {
           List<Client> client = _clientService.FindAll();
            return Ok(client);
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteById(int id)
        {
            try
            {
                _clientService.DeleteById(id);
                return NoContent(); // 204 No Content para exclusão bem-sucedida
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message); // 404 Not Found para cliente não encontrado
            }
        }
    }
}
