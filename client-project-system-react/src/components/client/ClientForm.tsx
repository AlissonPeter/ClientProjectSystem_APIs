import React, { useState, useRef } from 'react';
import axios from 'axios';
import TableClients from './TableClientsForm';
import './ClientForm.css';
import type { Client } from '../../model/Client';

const API_BACKEND_URL = 'http://localhost:8081/clients';

function ClientForm() {
  const [client, setClient] = useState<Client>({ id: null, name: '' });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const tableClientsRef = useRef<{ getClients: () => void }>(null);

  // 5. Métodos (equivalente a `methods` no Vue)
  const handleSelected = (clientSelected: Client) => {
    setClient(clientSelected);
  };

  const clearForm = () => {
    setClient({ id: null, name: '' });
    setSubmitted(false); // Reseta a mensagem de sucesso
    setResponse(null);   // Reseta a resposta do servidor
  };

  const handleSubmitForm = async (event: React.FormEvent) => {
    // `e.preventDefault()` é o equivalente a `@click.prevent` ou `@submit.prevent` no Vue
    event.preventDefault(); 
    setSubmitted(true);
    setResponse(null); // Limpa a resposta anterior

    try {
      if (client.name.trim() === '') {
        setResponse('O nome do cliente não pode ser vazio.');
        return;
      }

      if (client.id === null) {
        console.log('Create new client', client);
        const res = await axios.post(API_BACKEND_URL, client);
        setResponse(`Cliente criado: ${res.data.name} (ID: ${res.data.id})`);
      } else {
        console.log('Update client:', client.id, client);
        const res = await axios.put(`${API_BACKEND_URL}/${client.id}?name=${client.name}`);
        setResponse(`Cliente atualizado: ${res.data.name} (ID: ${res.data.id})`);
      }

      // Atualizar lista de clientes no TableClients
      // Acessando o método do componente filho via ref
      if (tableClientsRef.current) {
        tableClientsRef.current.getClients();
      }

      // Esconde a mensagem de sucesso após 3 segundos
      // Usamos `setTimeout` aqui, similar ao Vue.
      setTimeout(() => {
        setSubmitted(false);
        setResponse(null);
      }, 3000);

      clearForm(); // Limpa o formulário após a submissão
    } catch (error: any) {
      console.error('An error occurred:', error);
      if (axios.isAxiosError(error) && error.response) {
        setResponse(`Erro na requisição: ${error.response.data || error.message}`);
      } else {
        setResponse('Erro na requisição');
      }
    }
  };

  return (
    <div className="client-form">
      <h2>Cliente</h2>

      {/* Formulário */}
      {/* O evento `onSubmit` é no <form>, não nos botões submit */}
      <form onSubmit={handleSubmitForm}>
        <div>
          <label htmlFor="name">Nome:</label>
          {/* Input controlado (equivalente a v-model) */}
          {/* value={client.name} e onChange para atualizar o estado */}
          <input
            type="text"
            value={client.name}
            onChange={(e) => setClient({ ...client, name: e.target.value })}
            id="name"
            required // Adiciona validação HTML5 básica
          />
        </div>
        {/* Botão de submit do formulário - não precisa de @click.prevent se estiver dentro do form e for type="submit" */}
        <button type="submit">Enviar</button> 
        {/* Botão Limpar - pode ter @click.prevent ou apenas onClick */}
        <button type="button" onClick={clearForm}>Limpar</button>
      </form>
      
      {/* 10. Renderização Condicional (equivalente a v-if) */}
      {submitted && (
        <div className="form-message">
          <h3>{response ? 'Status' : 'Enviado com sucesso!'}</h3>
          {response && <p><strong>Detalhes:</strong> {response}</p>}
        </div>
      )}

      {/*Componente filho com ref */}
      {/* A prop `ref` é passada para o useRef.
          tableClients agora é TableClients */}
      <TableClients ref={tableClientsRef} onClientSelected={handleSelected} />
    </div>
  );
};

export default ClientForm;