using ClientProjectSystemLoginCSharp.Controllers;
using ClientProjectSystemLoginCSharp.Models;
using ClientProjectSystemLoginCSharp.Repositories;
using ClientProjectSystemLoginCSharp.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
// ... e também Moq e Xunit
using Xunit;

public class ClientServiceTests
{
    // Teste para o método SaveOrUpdate
    //InlineData testará os 2 clientes a serem inseridos
    [Theory]
    [InlineData(1, "Cliente Teste")]
    [InlineData(2, "Cliente Teste 2")]
    public void SaveOrUpdate_ShouldCallRepositorySaveOrUpdateOnce(int id, string name)
    {
        // Arrange (Preparar)
        // 1. Crie um objeto mock da interface IClientRepository.
        var mockRepository = new Mock<IClientRepository>();

        // 2. Não é necessário configurar um retorno para SaveOrUpdate, pois é um método void.
        //    Apenas dizemos ao Moq para aceitar qualquer chamada a SaveOrUpdate.
        //    mockRepository.Setup(r => r.SaveOrUpdate(It.IsAny<Client>())); // Isso é implícito para void methods.

        // 3. Crie uma instância do ClientService, injetando o mock do repositório.
        var clientService = new ClientService(mockRepository.Object);

        // 4. Exemplo de cliente para usar no teste.
        var clientToSave = new Client { Id = id, Name = name };

        clientService.SaveOrUpdate(clientToSave);

        // Verifica se o método SaveOrUpdate do repositório foi chamado exatamente uma vez,
        //    com o objeto cliente que foi passado.
        mockRepository.Verify(r => r.SaveOrUpdate(clientToSave), Times.Once());
    }

    // Teste para o método FindAll
    [Fact]
    public void FindAll_ShouldReturnListOfClients_FromRepository()
    {
        // Arrange
        var mockRepository = new Mock<IClientRepository>();
        var expectedClients = new List<Client>
        {
            new Client { Id = 1, Name = "Client A" },
            new Client { Id = 2, Name = "Client B" }
        };

        // Configure o mock: quando GetAll for chamado, retorne a lista de clientes esperada.
        mockRepository.Setup(r => r.GetAll()).Returns(expectedClients);

        var clientService = new ClientService(mockRepository.Object);

        // Act
        var result = clientService.FindAll();

        // Assert
        // Verifique se o resultado não é nulo e se contém a mesma quantidade de clientes.
        Assert.NotNull(result);
        Assert.Equal(expectedClients.Count, result.Count);
        // Verifique se os clientes retornados são os esperados.
        Assert.Contains(expectedClients[0], result);
        Assert.Contains(expectedClients[1], result);

        // Verifique se GetAll foi chamado uma vez.
        mockRepository.Verify(r => r.GetAll(), Times.Once());
    }

    // Teste para o método FindById quando o cliente existe
    [Fact]
    public void FindById_ShouldReturnClient_WhenClientExists()
    {
        // Arrange
        var mockRepository = new Mock<IClientRepository>();
        var expectedClient = new Client { Id = 5, Name = "Client Five" };

        // Configure o mock: quando GetById for chamado com ID 5, retorne o cliente esperado.
        mockRepository.Setup(r => r.GetById(5)).Returns(expectedClient);

        var clientService = new ClientService(mockRepository.Object);

        // Act
        var result = clientService.FindById(5);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedClient.Id, result.Id);
        Assert.Equal(expectedClient.Name, result.Name);

        // Verifique se GetById foi chamado uma vez com o ID 5.
        mockRepository.Verify(r => r.GetById(5), Times.Once());
    }

    // Teste para o método FindById quando o cliente NÃO existe
    [Fact]
    public void FindById_ShouldReturnNull_WhenClientDoesNotExist()
    {
        // Arrange
        var mockRepository = new Mock<IClientRepository>();

        // Configure o mock: quando GetById for chamado com qualquer ID, retorne null.
        mockRepository.Setup(r => r.GetById(It.IsAny<int?>())).Returns((Client)null);

        var clientService = new ClientService(mockRepository.Object);

        // Act
        var result = clientService.FindById(999); // Um ID que não existe

        // Assert
        Assert.Null(result);

        // Verifique se GetById foi chamado uma vez com o ID 999.
        mockRepository.Verify(r => r.GetById(999), Times.Once());
    }

    [Fact]
    public void DeleteById_ShouldReturnNoContent_WhenClientExists()
    {
        // Arrange
        var mockClientRepository = new Mock<IClientRepository>();
        var idToDelete = 10;
        var service = new ClientService(mockClientRepository.Object);

        // Configura o mock do repositório para retornar 1 quando o DeleteById for chamado
        mockClientRepository.Setup(r => r.DeleteById(idToDelete)).Returns(1);

        // Act
        var affectedRows = service.DeleteById(idToDelete);

        // Assert
        // O teste agora verifica se o valor retornado é o esperado (1)
        Assert.Equal(1, affectedRows);

        // Verifica se o método DeleteById do serviço foi chamado uma vez com o ID correto.
        mockClientRepository.Verify(s => s.DeleteById(idToDelete), Times.Once());
    }

    [Fact]
    public void DeleteById_ShouldReturnNotFound_WhenClientDoesNotExist()
    {
        // Arrange
        var mockClientRepository = new Mock<IClientRepository>();
        var idToDelete = 99;

        // Configura o mock do repositório: quando DeleteById for chamado com o ID 99,
        // ele deve retornar 0, simulando que nenhuma linha foi afetada.
        mockClientRepository.Setup(r => r.DeleteById(idToDelete)).Returns(0);

        // Instancia o serviço, injetando o repositório mockado.
        var service = new ClientService(mockClientRepository.Object);

        // Act & Assert
        // A sintaxe Assert.Throws espera uma exceção de um tipo específico.
        // Ele vai chamar o método do serviço e verificar se a exceção esperada é lançada.
        var ex = Assert.Throws<InvalidOperationException>(() => service.DeleteById(idToDelete));

        // Opcional, mas útil: verifique a mensagem da exceção.
        Assert.Equal($"Client with ID {idToDelete} not found.", ex.Message);

        // Verifique se o método do repositório foi chamado uma vez.
        mockClientRepository.Verify(r => r.DeleteById(idToDelete), Times.Once());
    }
}