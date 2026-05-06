import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import type { Activity } from '../../model/Activity';
import type { Status } from '../../model/Status';

import TableStatusForm, { type TableStatusFormRef } from '../status/TableStatusForm';

// Importa ícones
import removeIcon from '@/assets/Icons/remove.png';
import searchIcon from '@/assets/Icons/search.png';

import './ActivityForm.css';

const API_BACKEND_URL = 'http://localhost:8081';

// Estado inicial para uma nova atividade
const initialActivityState: Activity = {
  id: null,
  description: '',
  status: { id: null, description: '', kind: 0 },
};

// Interface para as props que ActivityForm recebe do ProjectForm
interface ActivityFormProps {
  activities: Activity[]; // Lista de atividades recebida do pai
  onActivitiesUpdated: (activities: Activity[]) => void; // Callback para enviar as atividades de volta
}

function ActivityForm({ activities, onActivitiesUpdated }: ActivityFormProps) {
  // Estados locais
  const [localActivities, setLocalActivities] = useState<Activity[]>([]);
  const [showTableStatus, setShowTableStatus] = useState<boolean>(false);
  const [activityIndex, setActivityIndex] = useState<number | null>(null); // Índice da atividade sendo editada
  const [activitiesChecked, setActivitiesChecked] = useState<number[]>([]); // Índices das atividades selecionadas para exclusão
  const [activity, setActivity] = useState<Activity>(initialActivityState); // Atividade atualmente no formulário
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const tableStatusRef = useRef<TableStatusFormRef>(null);

  // Equivalente ao `watch` do Vue para `activities` prop
  // Sincroniza `localActivities` com a prop `activities`
  useEffect(() => {
    setLocalActivities([...activities]); // Cria uma cópia profunda para evitar mutações diretas da prop
  }, [activities]);

  // --- Funções de Manipulação de Estado e Lógica ---

  const toggleTableStatus = () => {
    setShowTableStatus(true);
  };

  const handleStatusSelected = (selectedStatus: Status) => {
    setActivity((prevActivity) => ({
      ...prevActivity,
      status: { id: selectedStatus.id, description: selectedStatus.description, kind: selectedStatus.kind },
    }));
    setShowTableStatus(false);
  };

  const blockSigns = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  };

  const clearForm = () => {
    setActivity(initialActivityState);
    setActivityIndex(null); // Reseta o índice da atividade sendo editada
    setSubmitted(false);
    setResponseMessage(null);
  };

  const backProject = () => {
    onActivitiesUpdated(localActivities); // Envia as atividades modificadas de volta ao ProjectForm
    clearForm(); // Limpa o formulário ao voltar
  };

  const setActivityToForm = (selectedActivity: Activity, index: number) => {
    setActivity({ ...selectedActivity }); // Copia a atividade para edição
    setActivityIndex(index); // Armazena o índice para saber qual atividade atualizar no array
    console.log('activity selected for edit', selectedActivity);
  };

  const toggleSelection = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const isChecked = event.target.checked;
    setActivitiesChecked((prevChecked) => {
      if (isChecked) {
        return [...prevChecked, index];
      } else {
        return prevChecked.filter((item) => item !== index);
      }
    });
  };

  const loadStatus = async () => {
    if (activity.status.id === null) {
      setActivity((prevActivity) => ({
        ...prevActivity,
        status: { id: null, description: '', kind: null },
      }));
      return;
    }
    try {
      console.log('Load status for activity', activity.status.id);
      const response = await axios.get<Status>(`${API_BACKEND_URL}/status/${activity.status.id}`);
      handleStatusSelected(response.data); // Usa a função existente para setar o status
    } catch (error) {
      console.error('An error occurred:', error);
      setResponseMessage('Erro ao buscar o status da atividade');
      setActivity((prevActivity) => ({
        ...prevActivity,
        status: { id: null, description: '', kind: null }, // Limpa se não encontrado
      }));
    }
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault(); // Impede o comportamento padrão de submissão do formulário
    setSubmitted(true);
    setResponseMessage(null);

    try {
      if (activityIndex === null) {
        // Adicionar nova atividade
        setLocalActivities((prevLocalActivities) => [...prevLocalActivities, { ...activity }]);
        setResponseMessage('Atividade adicionada com sucesso!');
      } else {
        // Atualizar atividade existente
        setLocalActivities((prevLocalActivities) => {
          const newActivities = [...prevLocalActivities];
          newActivities[activityIndex] = { ...activity }; // Atualiza a atividade no índice correto como uma nova instância, por isso que é usado os 3 pontos
          return newActivities;
        });
        setResponseMessage('Atividade atualizada com sucesso!');
      }
      clearForm(); // Limpa o formulário após a operação
    } catch (error) {
      console.error('Ocorreu um erro:', error);
      setResponseMessage('Erro na operação da atividade.');
    } finally {
      setTimeout(() => {
        setSubmitted(false);
        setResponseMessage(null);
      }, 3000);
    }
  };

  const deleteActivitiesSelected = () => {
    setLocalActivities((prevLocalActivities) =>
      prevLocalActivities.filter((_, index) => !activitiesChecked.includes(index))
    );
    setActivitiesChecked([]); // Limpa a seleção
    clearForm(); // Limpa o formulário após exclusão
  };

  // --- Renderização Condicional ---
  if (showTableStatus) {
    return (
      <div className="activity-form"> {/* Usar a classe 'activity-form' */}
        <h3>Selecione um status:</h3>
        <TableStatusForm
          onStatusSelected={handleStatusSelected}
          ref={tableStatusRef}
        />
        <button onClick={() => setShowTableStatus(false)}>Voltar</button>
      </div>
    );
  }

  // --- Renderização do Formulário Principal e Tabela de Atividades ---
  return (
    <div className="activity-form"> {/* Usar a classe 'activity-form' */}
      <h2>Atividade</h2>
      <form onSubmit={submitForm}>
        <div className="input-container">
          <label htmlFor="input-activityDesc">Descrição:</label>
          <input
            type="text"
            value={activity.description}
            onChange={(e) => setActivity({ ...activity, description: e.target.value })}
            id="input-activityDesc" // ID específico para a descrição da atividade
          />
        </div>
        <div className="input-container">
          <label htmlFor="input-statusId">Status:</label>
          <input
            type="number"
            onKeyDown={blockSigns}
            onBlur={loadStatus}
            min={0}
            value={activity.status.id ?? ''}
            onChange={(e) =>
              setActivity({
                ...activity,
                status: { ...activity.status, id: e.target.value },
              })
            }
            id="input-statusId"
          />
          <button
            type="button"
            style={{ backgroundImage: `url(${searchIcon})` }}
            id="input-search"
            onClick={toggleTableStatus}
          ></button>
          <input type="text" value={activity.status.description} id="input-statusDesc" disabled />
        </div>
        <div>
          <button type="button" onClick={clearForm}>Limpar</button>
        </div>
        <button type="submit">Enviar</button>
        <button type="button" onClick={backProject}>Voltar</button>
      </form>

      {/* Seção de feedback do formulário */}
      {submitted && (
        <div className="form-message">
          <h3>{!responseMessage ? 'Enviado com sucesso!' : 'Erro!'}</h3>
          {responseMessage && <p><strong>Detalhes:</strong> {responseMessage}</p>}
        </div>
      )}

      {/* Tabela de Atividades Cadastradas */}
      <div className="table-container">
        <h3>Atividades Cadastradas</h3>
        <table id="tableActivities"> {/* ID diferente para esta tabela */}
          <thead>
            <tr>
              <th className="cursor-auto">Descrição</th>
              <th className="cursor-auto">Status</th>
              <th onClick={deleteActivitiesSelected} style={{ backgroundImage: `url(${removeIcon})` }} className="remove-icon-cell"></th>
            </tr>
          </thead>
          <tbody>
            {localActivities.length > 0 ? (
              localActivities.map((activityItem, index) => (
                <tr key={activityItem.id !== null ? activityItem.id : `new-${index}`}> {/* Adicionado key para novas atividades */}
                  <td onClick={() => setActivityToForm(activityItem, index)}>{activityItem.description}</td>
                  <td onClick={() => setActivityToForm(activityItem, index)}>
                    {activityItem.status.id} - {activityItem.status.description}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox-remove"
                      onChange={(e) => toggleSelection(e, index)}
                      checked={activitiesChecked.includes(index)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>Nenhuma atividade cadastrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActivityForm;