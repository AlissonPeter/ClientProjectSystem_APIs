import React, { useState, useRef } from 'react';
import axios from 'axios';
import type { Status } from '../../model/Status';
import { KindEnum } from './KindEnum';
import TableStatus from './TableStatusForm';

import './StatusForm.css';

const API_BACKEND_URL = 'http://localhost:8081/status'; 

function StatusForm() {
  // 4. Estado (equivalente a `data()` no Vue)
  const [status, setStatus] = useState<Status>({ id: null, description: '', kind: 0 });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);

  // 5. Opções para o select, carregadas do KindEnum
  const kinds = KindEnum.getOptions();

  // 6. Ref para o componente filho TableStatus
  const tableStatusRef  = useRef<{ getStatus: () => void }>(null);

  // 7. Métodos (equivalente a `methods` no Vue)
  const handleSelected = (selectedStatus: Status) => {
    setStatus(selectedStatus);
  };

  const clearForm = () => {
    setStatus({ id: null, description: '', kind: 0 });
    setSubmitted(false);
    setResponse(null);
  };

  // setStatus do Vue não é mais necessário como um método separado.
  // A atualização do estado é feita diretamente via setStatus do useState.
  const handleSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault(); 
    setSubmitted(true);
    setResponse(null);

    try {
      if (status.description.trim() === '') {
        setResponse('A descrição do status não pode ser vazia.');
        return;
      }

      if (status.id === null) {
        console.log('Create new status', status);
        const res = await axios.post(API_BACKEND_URL, status);
        setResponse(`Status criado: ${res.data.description} (ID: ${res.data.id})`);
      } else {
        console.log('Update status:', status.id, status);
        const res =await axios.put(`${API_BACKEND_URL}/${status.id}?description=${status.description}&kind=${status.kind}`);
        setResponse(`Status atualizado: ${res.data.description} (ID: ${res.data.id})`);
      }

      // 8. Atualizar lista de status no TableStatus
      if (tableStatusRef.current) {
        tableStatusRef.current.getStatus();
      }

      // 9. Esconde a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSubmitted(false);
        setResponse(null);
      }, 3000);

      clearForm(); // Limpa o formulário após a submissão
    } catch (error) {
      console.error('An error occurred:', error);
      if (axios.isAxiosError(error) && error.response) {
        setResponse(`Erro na requisição: ${error.response.data || error.message}`);
      } else {
        setResponse('Erro na requisição');
      }
    }
  };

  return (
    <div className="status-form">
      <h2>Status</h2>
      {/* 10. Formulário com onSubmit */}
      <form onSubmit={handleSubmitForm}>
        <div>
          <label htmlFor="input-statusDesc">Descrição:</label>
          {/* 11. Input controlado com v-model */}
          <input
            type="text"
            value={status.description}
            onChange={(e) => setStatus({ ...status, description: e.target.value })}
            id="input-statusDesc"
            required
          />
          <label htmlFor="kind">Tipo:</label>
          {/* 12. Select controlado com v-model */}
          <select
            value={status.kind || ''} // Use '' para o estado inicial se kind for null
            onChange={(e) => setStatus({ ...status, kind: parseInt(e.target.value) || null })}
            id="kind"
            required
          >
            {kinds.map((kindOption) => (
              <option key={kindOption.id} value={kindOption.id}>
                {kindOption.id} - {kindOption.description}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Enviar</button>
        <button type="button" onClick={clearForm}>Limpar</button>
      </form>

      {/* 14. Renderização Condicional */}
      {submitted && (
        <div className="form-message">
          <h3>{response ? 'Status' : 'Enviado com sucesso!'}</h3>
          {response && <p><strong>Detalhes:</strong> {response}</p>}
        </div>
      )}
      
      {/* 15. Componente filho com ref e prop */}
      <TableStatus ref={tableStatusRef} onStatusSelected={handleSelected} />
    </div>
  );
}

export default StatusForm;