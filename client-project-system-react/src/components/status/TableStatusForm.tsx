import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import type { Status } from '../../model/Status';
import { KindEnum } from './KindEnum';
import removeIcon from '@/assets/Icons/remove.png';

// Props para este componente
interface TableStatusFormProps {
  onStatusSelected: (status: Status) => void; // Callback para quando um status é selecionado
}

// Métodos que serão expostos via ref para o componente pai (StatusForm)
export interface TableStatusFormRef {
  getStatus: () => void;
}

// Use forwardRef para que o componente pai possa acessar a ref
const TableStatusForm: React.ForwardRefRenderFunction<TableStatusFormRef, TableStatusFormProps> = (
  { onStatusSelected },
  ref // O parâmetro ref é recebido aqui
) => {
  // Estado para armazenar a lista de status
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_BACKEND_URL = 'http://localhost:8081/status'; 

  // Função para buscar os status da API
  const getStatus = async () => {
    setLoading(true);
    setError(null); // Limpa erros anteriores
    try {
      const response = await axios.get<Status[]>(`${API_BACKEND_URL}/all`);
      console.log('resposta do servidor', response.data);
      setStatusList(response.data); // Atualiza o estado com os dados recebidos
    } catch (err) {
      console.error('Erro ao buscar status:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Falha ao carregar status: ${err.response.data?.message || err.message}`);
      } else {
        setError('Falha ao carregar status.');
      }
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  // useEffect para chamar getStatus na montagem do componente (equivalente ao `mounted()` do Vue)
  useEffect(() => {
    getStatus();
  }, []); // Array de dependências vazio garante que roda apenas uma vez

  // useImperativeHandle expõe `getStatus` para o ref do componente pai
  useImperativeHandle(ref, () => ({
    getStatus,
  }));

  // Função para lidar com a seleção de um status na tabela
  const handleStatusSelection = (selectedStatus: Status) => {
    console.log('status selected', selectedStatus);
    onStatusSelected(selectedStatus); // Chama o callback passado via props para o pai
  };

  // Função para obter a descrição do tipo (usando a classe KindEnum)
  const getKindDescription = (kindId: number | null): string => {
    if (kindId === null) {
      return 'N/A';
    }
    // Acessa o método estático da classe KindEnum
    return KindEnum.getDescription(kindId);
  };

  // Função para deletar status selecionados
  const deleteStatusSelected = async () => {
    try {
      const table = document.getElementById("tableStatus") as HTMLTableElement; // Se o ID da tabela for "tableClients"
      if (!table) {
        alert("Erro: Tabela de status não encontrada para exclusão.");
        return;
      }
      
      const checkboxes = table.querySelectorAll<HTMLInputElement>(".checkboxRemove:checked");
      let statusIdSelected: number[] = [];

      checkboxes.forEach(checkbox => {
          const row = checkbox.closest("tr");
          if (row) {
              const statusIdText = row.cells[0]?.textContent; // ID está na primeira célula
              if (statusIdText) {
                  statusIdSelected.push(parseInt(statusIdText));
              }
          }
      });

      if (statusIdSelected.length === 0) {
          alert("Selecione pelo menos um status para remover.");
          return;
      }

      for (const statusId of statusIdSelected) {
        await axios.delete(`${API_BACKEND_URL}/${statusId}`);
        console.log(`Status ${statusId} removed`);
      }
      
      getStatus(); // Recarrega a lista de status após a exclusão
      alert(`Status removidos: ${statusIdSelected.join(', ')}`);
    } catch (err) {
      console.error('Error deleting statuses:', err);
      if (axios.isAxiosError(err) && err.response) {
        alert(`Erro ao remover status: ${err.response.data?.message || err.message}`);
      } else {
        alert('Erro ao remover status.');
      }
    }
  };

  // Renderização condicional para estados de carregamento, erro e lista vazia
  if (loading) {
    return <p>Carregando status...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (statusList.length === 0) {
    return <p>Nenhum status cadastrado.</p>;
  }

  return (
    <div className="status-form"> {/* Mantive o nome da classe do componente anterior para consistência */}
      <h3>Cadastrados</h3>
      <table id="tableStatus"> {/* O ID da tabela no seu Vue era "tableClients", mantive para a manipulação de DOM */}
        <thead>
          <tr>
            <th className="cursor">ID</th>
            <th className="cursor">Descrição</th>
            <th className="cursor">Tipo</th>
            {/* O evento de clique é diretamente no th, e o estilo de background no `style` */}
            <th
                style={{ backgroundImage: `url(${removeIcon})` }}
                className="remove-client-icon"
                onClick={deleteStatusSelected}
            ></th>
          </tr>
        </thead>
        <tbody>
          {/* Mapeia a lista de status para criar as linhas da tabela */}
          {statusList.map((status) => (
            <tr key={status.id}>
              {/* O clique em cada TD chama handleStatusSelection */}
              <td onClick={() => handleStatusSelection(status)}> {status.id}</td>
              <td onClick={() => handleStatusSelection(status)}> {status.description}</td>
              <td onClick={() => handleStatusSelection(status)}>
                {/* Exibe o ID e a descrição do tipo */}
                {status.kind !== null ? `${status.kind} - ${getKindDescription(status.kind)}` : 'N/A'}
              </td>
              <td><input type="checkbox" className="checkboxRemove" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Exporta o componente envolvido por forwardRef
export default forwardRef(TableStatusForm);