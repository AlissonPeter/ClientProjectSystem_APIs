import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import removeIcon from '@/assets/Icons/remove.png';
import './TableClientsForm.css';
import type { Client } from '../../model/Client';

// 2. Props para este componente (o pai ClientForm passará `onClientSelected`)
interface TableClientsFormProps {
  onClientSelected: (client: Client) => void;
}

// 3. Métodos que serão expostos via ref para o componente pai
export interface TableClientsFormRef {
  getClients: () => void;
}

// 4. Componente funcional usando `forwardRef` para permitir o uso de refs
const TableClientsForm: React.ForwardRefRenderFunction<TableClientsFormRef, TableClientsFormProps> = (
  { onClientSelected }, // Desestruturando as props
  ref // O ref passado do componente pai
) => {
  // 5. Estado (equivalente a `data()` no Vue)
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_BACKEND_URL = 'http://localhost:8081/clients'; // URL base para a API de clientes

  // 6. Função para buscar clientes (equivalente a `getClients` no Vue methods)
  const getClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Client[]>(`${API_BACKEND_URL}/all`);
      console.log('resposta do servidor', response.data);
      setClients(response.data);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Falha ao carregar clientes: ${err.response.data || err.message}`);
      } else {
        setError('Falha ao carregar clientes.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 7. `useEffect` para carregar clientes na montagem do componente (equivalente a `mounted()` no Vue)
  useEffect(() => {
    getClients();
  }, []); // Array de dependências vazio: executa apenas uma vez após a montagem inicial

  // 8. `useImperativeHandle` para expor `getClients` via ref (simulando `$refs.tableClients.getClients()`)
  useImperativeHandle(ref, () => ({
    getClients, // Expõe a função getClients para ser chamada pelo componente pai
  }));

  // 9. Função para selecionar um cliente e emitir para o pai (equivalente a `setClient` e `$emit`)
  const handleClientSelection = (client: Client) => {
    const selectedClient: Client = { id: client.id, name: client.name };
    console.log('client selected', selectedClient);
    onClientSelected(selectedClient); // Chama a função de callback passada via props
  };

  // 10. Função para deletar clientes selecionados
  const deleteClientsSelected = async () => {
    try {
      const table = document.getElementById("tableClients") as HTMLTableElement;
      if (!table) {
        console.error("TableClients element not found.");
        return;
      }
      
      const checkboxes = table.querySelectorAll<HTMLInputElement>(".checkboxRemove:checked");
      let clientsIdSelected: number[] = [];

      checkboxes.forEach(checkbox => {
          const row = checkbox.closest("tr");
          if (row) {
              const clientIdText = row.cells[0]?.textContent; // Pega o texto da primeira célula (ID)
              if (clientIdText) {
                  clientsIdSelected.push(parseInt(clientIdText));
              }
          }
      });

      if (clientsIdSelected.length === 0) {
          alert("Selecione pelo menos um cliente para remover.");
          return;
      }

      for (const clientId of clientsIdSelected) {
        await axios.delete(`${API_BACKEND_URL}/${clientId}`);
        console.log(`Client ${clientId} removed`);
      }
      
      getClients(); // Atualiza a lista após a exclusão
      alert(`Clientes removidos: ${clientsIdSelected.join(', ')}`);
    } catch (err) {
      console.error('Error deleting clients:', err);
      if (axios.isAxiosError(err) && err.response) {
        alert(`Erro ao remover clientes: ${err.response.data || err.message}`);
      } else {
        alert('Erro ao remover clientes.');
      }
    }
  };

  // 12. Renderização condicional para estados de carregamento/erro/vazio
  if (loading) {
    return <p>Carregando clientes...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="clients-form">
      <h3>Cadastrados</h3>
      {clients.length === 0 ? (
        <p>Nenhum cliente cadastrado.</p>
      ) : (
        <table id="tableClients">
          <thead>
            <tr>
              <th className="cursor">ID</th>
              <th className="cursor">Cliente</th>
              <th
                style={{ backgroundImage: `url(${removeIcon})` }}
                className="remove-client-icon"
                onClick={deleteClientsSelected}
              ></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td onClick={() => handleClientSelection(client)}>
                  {client.id}
                </td>
                <td onClick={() => handleClientSelection(client)}>
                  {client.name}
                </td>
                <td>
                  <input type="checkbox" className="checkboxRemove" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// 14. Exporta o componente envolvido com forwardRef
export default forwardRef(TableClientsForm);