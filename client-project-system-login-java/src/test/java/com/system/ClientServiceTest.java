package com.system;

import com.system.model.Client;
import com.system.repository.ClientRepository;
import com.system.service.ClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository; // mock do repository

    @InjectMocks
    private ClientService clientService; // service com o repository mockado

    private Client client;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // inicializa os mocks

        client = new Client();
        client.setId(1);
        client.setName("João");
    }

    @Test
    void testFindById_WhenClientExists() {
        // Configura o mock para retornar cliente quando buscar por id=1
        when(clientRepository.findById(1)).thenReturn(Optional.of(client));

        Client found = clientService.findById(1);

        assertNotNull(found);
        assertEquals(1, found.getId());
        assertEquals("João", found.getName());

        verify(clientRepository, times(1)).findById(1); // garante que o método foi chamado
    }

    @Test
    void testFindById_WhenClientDoesNotExist() {
        // Configura o mock para retornar vazio
        when(clientRepository.findById(1)).thenReturn(Optional.empty());

        // Espera que seja lançada RuntimeException
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            clientService.findById(1);
        });

        assertEquals("Client not found", exception.getMessage());
        verify(clientRepository, times(1)).findById(1);
    }

    @Test
    void testSaveOrUpdate() {
        // Configura o mock para retornar o mesmo client quando salvar
        when(clientRepository.save(client)).thenReturn(client);

        clientService.saveOrUpdate(client);

        // Verifica que o save foi chamado com o client
        verify(clientRepository, times(1)).save(client);
    }

    @Test
    void testDeleteById() {
        doNothing().when(clientRepository).deleteById(1);

        clientService.deleteById(1);

        verify(clientRepository, times(1)).deleteById(1);
    }

    @ParameterizedTest
    @CsvSource({
            "3, José",
            "4, Pedro"
    })
    void testFindAll(int id, String name) {
        final Client client2 = new Client();
        client2.setId(id);
        client2.setName(name);
        List<Client> clients = Arrays.asList(client, client2);
        when(clientRepository.findAll()).thenReturn(clients);

        List<Client> result = clientService.findAll();

        assertEquals(2, result.size());
        assertEquals("João", result.get(0).getName());
        assertEquals(name, result.get(1).getName());

        verify(clientRepository, times(1)).findAll();
    }
}
