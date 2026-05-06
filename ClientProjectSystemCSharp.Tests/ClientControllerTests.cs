using ClientProjectSystemLoginCSharp.Controllers;
using ClientProjectSystemLoginCSharp.Models;
using ClientProjectSystemLoginCSharp.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClientProjectSystemLoginCSharp.Tests
{
    public class ClientControllerTests
    {
        [Fact]
        public void CreateClient_ShouldReturnCreatedAtAction()
        {
            // Arrange (Preparar)
            var mockClientService = new Mock<IClientService>();
            var controller = new ClientController(mockClientService.Object);
            var clientToCreate = new Client { Id = 1, Name = "New Client" };

            // Act (Agir)
            var result = controller.CreateClient(clientToCreate);

            // Assert (Verificar)
            // 1. Verifique se o resultado é do tipo CreatedAtActionResult
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            // 2. Verifique se o status code é 201 (Created)
            Assert.Equal(201, createdAtActionResult.StatusCode);
            // 3. Verifique se o método SaveOrUpdate do serviço foi chamado uma vez
            mockClientService.Verify(s => s.SaveOrUpdate(clientToCreate), Times.Once());
            // 4. Verifique se o objeto retornado é o cliente correto
            var createdClient = Assert.IsType<Client>(createdAtActionResult.Value);
            Assert.Equal(clientToCreate.Id, createdClient.Id);
        }

        [Fact]
        public void UpdateById_ShouldReturnNoContent_WhenClientExists()
        {
            // Arrange
            var mockClientService = new Mock<IClientService>();
            var existingClient = new Client { Id = 1, Name = "Old Name" };
            var newName = "New Name";

            // Mockar o serviço para retornar o cliente existente quando FindById for chamado
            mockClientService.Setup(s => s.FindById(1)).Returns(existingClient);

            var controller = new ClientController(mockClientService.Object);

            // Act
            var result = controller.UpdateById(1, newName);

            // Assert
            // 1. Verifique se o resultado é do tipo NoContentResult
            Assert.IsType<NoContentResult>(result);
            // 2. Verifique se o método FindById foi chamado uma vez
            mockClientService.Verify(s => s.FindById(1), Times.Once());
            // 3. Verifique se o método SaveOrUpdate foi chamado uma vez, e se o nome foi atualizado
            // O Verify permite verificar o objeto que foi passado para o método
            mockClientService.Verify(s => s.SaveOrUpdate(It.Is<Client>(c => c.Id == 1 && c.Name == newName)), Times.Once());
        }

        [Fact]
        public void UpdateById_ShouldReturnNotFound_WhenClientDoesNotExist()
        {
            // Arrange
            var mockClientService = new Mock<IClientService>();
            var nonExistentId = 99;

            // Mockar o serviço para retornar null quando FindById for chamado com o ID 99
            mockClientService.Setup(s => s.FindById(nonExistentId)).Returns((Client)null);

            var controller = new ClientController(mockClientService.Object);

            // Act
            var result = controller.UpdateById(nonExistentId, "New Name");

            // Assert
            // 1. Verifique se o resultado é do tipo NotFoundResult
            Assert.IsType<NotFoundResult>(result);
            // 2. Verifique se o método FindById foi chamado uma vez
            mockClientService.Verify(s => s.FindById(nonExistentId), Times.Once());
            // 3. Verifique que o método SaveOrUpdate NÃO FOI chamado
            mockClientService.Verify(s => s.SaveOrUpdate(It.IsAny<Client>()), Times.Never());
        }

        [Fact]
        public void GetById_ShouldReturnOk_WhenClientExists()
        {
            // Arrange
            var mockClientService = new Mock<IClientService>();
            var expectedClient = new Client { Id = 1, Name = "Test Client" };
            mockClientService.Setup(s => s.FindById(1)).Returns(expectedClient);

            var controller = new ClientController(mockClientService.Object);

            // Act
            var result = controller.GetById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var client = Assert.IsType<Client>(okResult.Value);
            Assert.Equal(expectedClient.Id, client.Id);
            Assert.Equal(expectedClient.Name, client.Name);
        }

        [Fact]
        public void GetById_ShouldReturnNotFound_WhenClientDoesNotExist()
        {
            // Arrange
            var mockClientService = new Mock<IClientService>();
            var nonExistentId = 99;
            var expectedMessage = $"Client with ID {nonExistentId} not found.";

            // Configura o mock para lançar a exceção com a mensagem esperada
            mockClientService.Setup(s => s.FindById(nonExistentId))
                             .Throws(new InvalidOperationException(expectedMessage));

            var controller = new ClientController(mockClientService.Object);

            // Act
            var result = controller.GetById(nonExistentId);

            // Assert
            // 1. O teste agora espera um NotFoundObjectResult
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            // 2. Opcional, mas recomendado: verifique se a mensagem é a esperada
            Assert.Equal(expectedMessage, notFoundResult.Value);
        }

        [Fact]
        public void FindAll_ShouldReturnOkWithListOfClients()
        {
            // Arrange
            // Mock do serviço que o controller depende.
            var mockClientService = new Mock<IClientService>();

            // Criar uma lista de clientes falsos para o mock retornar.
            var clients = new List<Client>
        {
            new Client { Id = 1, Name = "Client A" },
            new Client { Id = 2, Name = "Client B" }
        };

            // Configurar o mock: quando FindAll for chamado, retorne a lista de clientes.
            mockClientService.Setup(s => s.FindAll()).Returns(clients);

            // Instanciar o controller, injetando o serviço mockado.
            var controller = new ClientController(mockClientService.Object);

            // Act
            // Chamar o método do controller que estamos testando.
            var result = controller.FindAll();

            // Assert
            // 1. Verifique se o resultado é do tipo OkObjectResult (200 OK).
            var okResult = Assert.IsType<OkObjectResult>(result.Result);

            // 2. Verifique se o valor do resultado é uma coleção de clientes.
            var returnedClients = Assert.IsAssignableFrom<List<Client>>(okResult.Value);

            // 3. Verifique se a contagem da lista retornada é a esperada.
            Assert.Equal(clients.Count, returnedClients.Count);

            // 4. Verifique se o método FindAll do serviço foi chamado exatamente uma vez.
            mockClientService.Verify(s => s.FindAll(), Times.Once());
        }

        [Fact]
        public void DeleteById_ShouldReturnNoContent_WhenClientExists()
        {
            // Arrange
            var mockClientService = new Mock<IClientService>();
            var idToDelete = 10;
            var controller = new ClientController(mockClientService.Object);

            // Não precisamos configurar o mock para o cenário de sucesso.
            // O padrão do Moq para métodos void é não fazer nada, que é o que esperamos.

            // Act
            var result = controller.DeleteById(idToDelete);

            // Assert
            // Verifica se o resultado é do tipo NoContentResult (204).
            Assert.IsType<NoContentResult>(result);

            // Verifica se o método DeleteById do serviço foi chamado uma vez com o ID correto.
            mockClientService.Verify(s => s.DeleteById(idToDelete), Times.Once());
        }

        [Fact]
        public void DeleteById_ShouldReturnNotFound_WhenClientDoesNotExist()
        {
            // Arrange
            var mockClientService = new Mock<IClientService>();
            var idToDelete = 99; // Um ID que não existe.
            var controller = new ClientController(mockClientService.Object);

            // Configura o mock: quando DeleteById for chamado, ele lança a exceção.
            mockClientService.Setup(s => s.DeleteById(idToDelete))
                             .Throws(new InvalidOperationException($"Client with ID {idToDelete} not found."));

            // Act
            var result = controller.DeleteById(idToDelete);

            // Assert
            // Verifica se o resultado é do tipo NotFoundResult (404).
            Assert.IsType<NotFoundObjectResult>(result);

            // Verifica se o método do serviço foi chamado uma vez.
            mockClientService.Verify(s => s.DeleteById(idToDelete), Times.Once());
        }
    }
}
