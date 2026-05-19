package com.system;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.system.controller.ClientController;
import com.system.model.Client;
import com.system.service.ClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(ClientController.class)  // Diz ao Spring que vamos testar apenas o ClientController
class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc; // Objeto usado para simular chamadas HTTP sem subir servidor

    @MockBean
    private ClientService clientService; // Mock da camada de serviço (não usa o real, só simulado)

    @Autowired
    private ObjectMapper objectMapper; // Converte objetos Java <-> JSON

    private Client client;

    @BeforeEach
    void setUp() {
        // Criamos um cliente de exemplo para usar em vários testes
        client = new Client();
        client.setId(1);
        client.setName("João");
    }

    @Test
    void testGetClientById() throws Exception {
        // Quando o service for chamado com id=1, retorna o cliente mockado
        when(clientService.findById(1)).thenReturn(client);

        // Simula uma requisição GET em /clients/1
        mockMvc.perform(get("/clients/1"))
                // Espera que o status seja 200 OK
                .andExpect(status().isOk())
                // Espera que o campo id no JSON seja 1
                .andExpect(jsonPath("$.id").value(1))
                // Espera que o campo name no JSON seja "João"
                .andExpect(jsonPath("$.name").value("João"));
    }

    @Test
    void testCreateClient() throws Exception {
        // Configura para não fazer nada quando salvar
        doNothing().when(clientService).saveOrUpdate(any(Client.class));

        // Simula requisição POST em /clients com JSON no corpo
        mockMvc.perform(post("/clients")
                        .contentType(MediaType.APPLICATION_JSON) // Define que o corpo é JSON
                        .content(objectMapper.writeValueAsString(client))) // Converte o objeto client em JSON
                .andExpect(status().isOk()) // Espera status 200 OK
                .andExpect(jsonPath("$.id").value(1)) // Espera id=1 no JSON
                .andExpect(jsonPath("$.name").value("João")); // Espera name="João"

        // Verifica que o método saveOrUpdate foi chamado
        verify(clientService, times(1)).saveOrUpdate(any(Client.class));
    }

    @Test
    void testDeleteById() throws Exception {
        // Configura para não fazer nada quando deletar id=1
        doNothing().when(clientService).deleteById(1);

        // Simula requisição DELETE em /clients/1
        mockMvc.perform(delete("/clients/1"))
                .andExpect(status().isOk()); // Espera status 200 OK

        // Verifica se o método deleteById foi chamado exatamente 1 vez
        verify(clientService, times(1)).deleteById(1);
    }

    @Test
    void testUpdateById() throws Exception {
        when(clientService.findById(1)).thenReturn(client); // retorna Client
        doNothing().when(clientService).saveOrUpdate(any(Client.class));

        mockMvc.perform(put("/clients/1")
                        .param("name", "Maria"))
                .andExpect(status().isOk());

        // Verifica que realmente salvou
        verify(clientService, times(1)).saveOrUpdate(any(Client.class));
    }


    @ParameterizedTest
    @CsvSource({
            "3, José",
            "4, Pedro"
    })
    void testFindAll(int id, String name) throws Exception {
        final Client client2 = new Client();
        client2.setId(id);
        client2.setName(name);
        // Cria lista de dois clientes
        List<Client> clients = Arrays.asList(client, client2);
        // Configura mock para retornar essa lista
        when(clientService.findAll()).thenReturn(clients);

        // Simula requisição GET em /clients/all
        mockMvc.perform(get("/clients/all"))
                .andExpect(status().isOk()) // Espera 200 OK
                // Verifica que a lista retornada tem tamanho 2
                .andExpect(jsonPath("$.length()").value(2))
                // Verifica que o primeiro cliente tem name="João"
                .andExpect(jsonPath("$[0].name").value("João"))
                // Verifica que o segundo cliente tem name="Maria"
                .andExpect(jsonPath("$[1].name").value(name));
    }
}
