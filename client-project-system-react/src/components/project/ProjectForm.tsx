// src/components/Project/ProjectForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import type { Project } from '../../model/Project';
import type { Client } from '../../model/Client';
import type { Status } from '../../model/Status';
import type { Activity } from '../../model/Activity';

// Importa componentes filhos
import TableClientsForm, { type TableClientsFormRef } from '../client/TableClientsForm';
import TableStatusForm, { type TableStatusFormRef } from '../status/TableStatusForm';
import ActivityForm from '../activity/ActivityForm';

// Importa ícones
import removeIcon from '@/assets/Icons/remove.png';
import searchIcon from '@/assets/Icons/search.png';

import './ProjectForm.css';

const API_BACKEND_URL = 'http://localhost:8081';

// Estado inicial para um novo projeto
const initialProjectState: Project = {
  id: null,
  description: '',
  activities: [],
  status: { id: null, description: '', kind: 0 }, // Kind: null para novo status, como no StatusForm
  client: { id: null, name: '' },
};

function ProjectForm() {
  // Estados para controlar a exibição dos sub-componentes
  const [showTableClients, setShowTableClients] = useState<boolean>(false);
  const [showTableStatus, setShowTableStatus] = useState<boolean>(false);
  const [showActivities, setShowActivities] = useState<boolean>(false);

  // Estado para o projeto atual no formulário
  const [project, setProject] = useState<Project>(initialProjectState);
  // Estado para a lista de projetos cadastrados (na tabela)
  const [projects, setProjects] = useState<Project[]>([]);

  // Estados para feedback do formulário
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  // Refs para chamar métodos dos componentes de tabela
  const tableClientsRef = useRef<TableClientsFormRef>(null);
  const tableStatusRef = useRef<TableStatusFormRef>(null);

  // --- Funções de Manipulação de Estado e Lógica ---

  // Função para buscar todos os projetos para a tabela
  const getProjects = async () => {
    try {
      const response = await axios.get<Project[]>(`${API_BACKEND_URL}/projects/all`);
      console.log('resposta do servidor (projetos)', response.data);
      setProjects(response.data);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      setResponseMessage('Erro ao carregar projetos.');
    }
  };

  // Chama getProjects na montagem do componente (equivalente ao `mounted()` do Vue)
  useEffect(() => {
    getProjects();
  }, []);

  // Atualiza as atividades do projeto (callback do ActivityForm)
  const updateActivities = (newActivities: Activity[]) => {
    setProject((prevProject) => ({
      ...prevProject,
      activities: newActivities,
    }));
    setShowActivities(false); // Esconde o formulário de atividades após a atualização
  };

  // Alterna a visibilidade da tabela de clientes
  const toggleTableClients = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowTableClients(true);
  };

  // Alterna a visibilidade da tabela de status
  const toggleTableStatus = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowTableStatus(true);
  };

  // Lida com a seleção de um cliente na Tabela de Clientes
  const handleClientSelected = (client: Client) => {
    setProject((prevProject) => ({
      ...prevProject,
      client: { id: client.id, name: client.name },
    }));
    setShowTableClients(false); // Fecha a tabela após a seleção
  };

  // Lida com a seleção de um status na Tabela de Status
  const handleStatusSelected = (status: Status) => {
    setProject((prevProject) => ({
      ...prevProject,
      status: { id: status.id, description: status.description, kind: status.kind },
    }));
    setShowTableStatus(false); // Fecha a tabela após a seleção
  };

  // Impede a digitação de sinais de adição/subtração em campos numéricos
  const blockSigns = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  };

  // Limpa o formulário, resetando o estado do projeto para o estado inicial
  const clearForm = () => {
    setProject(initialProjectState);
    setSubmitted(false);
    setResponseMessage(null);
  };

  // Preenche o formulário com dados de um projeto selecionado da tabela
  const setProjectToForm = (selectedProject: Project) => {
    setProject({ ...selectedProject }); // Copia o objeto para evitar mutação direta
    console.log('project', selectedProject);
  };

  // Carrega os dados do status ao sair do campo de ID
  const loadStatus = async () => {
    if (project.status.id === null) {
      setProject((prevProject) => ({
        ...prevProject,
        status: { id: null, description: '', kind: null },
      }));
      return;
    }
    try {
      console.log('Load status', project.status.id);
      const response = await axios.get<Status>(`${API_BACKEND_URL}/status/${project.status.id}`);
      setProject((prevProject) => ({
        ...prevProject,
        status: { id: response.data.id, description: response.data.description, kind: response.data.kind },
      }));
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      setResponseMessage('Erro ao buscar o status');
      setProject((prevProject) => ({
        ...prevProject,
        status: { id: null, description: '', kind: null }, // Limpa se não encontrado
      }));
    }
  };

  // Carrega os dados do cliente ao sair do campo de ID
  const loadClient = async () => {
    if (project.client.id === null) {
      setProject((prevProject) => ({
        ...prevProject,
        client: { id: null, name: '' },
      }));
      return;
    }
    try {
      console.log('Load Client', project.client.id);
      const response = await axios.get<Client>(`${API_BACKEND_URL}/clients/${project.client.id}`);
      setProject((prevProject) => ({
        ...prevProject,
        client: { id: response.data.id, name: response.data.name },
      }));
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      setResponseMessage('Erro ao buscar o cliente');
      setProject((prevProject) => ({
        ...prevProject,
        client: { id: null, name: '' }, // Limpa se não encontrado
      }));
    }
  };

  // Submete o formulário (criar ou atualizar projeto)
  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setResponseMessage(null); // Limpa mensagens anteriores

    try {
      let res: any;
      if (project.id === null) {
        console.log('Criar novo projeto', project);
        res = await axios.post<Project>(`${API_BACKEND_URL}/projects`, project);
        // Adiciona o novo projeto à lista da tabela
        setProjects((prevProjects) => [...prevProjects, res.data]);
        setResponseMessage('Projeto criado com sucesso!');
      } else {
        console.log('Atualizar projeto:', project.id, project);
        res = await axios.put<Project>(`${API_BACKEND_URL}/projects`, project);
        // Atualiza o projeto na lista da tabela
        setProjects((prevProjects) =>
          prevProjects.map((p) => (p.id === project.id ? project : p))
        );
        setResponseMessage('Projeto atualizado com sucesso!');
      }
      clearForm(); // Limpa o formulário após sucesso

    } catch (error) {
      console.error('Ocorreu um erro:', error);
      if (axios.isAxiosError(error) && error.response) {
        setResponseMessage(`Erro na requisição: ${error.response.data?.message || error.message}`);
      } else {
        setResponseMessage('Erro na requisição.');
      }
    } finally {
      // Limpa a mensagem de feedback após um tempo
      setTimeout(() => {
        setSubmitted(false);
        setResponseMessage(null);
      }, 3000);
    }
  };

  // Deleta projetos selecionados na tabela
  const deleteProjectsSelected = async () => {
    try {
      const table = document.getElementById("tableProjects") as HTMLTableElement;
      if (!table) {
        alert("Erro: Tabela de projetos não encontrada para exclusão.");
        return;
      }
      
      const checkboxes = table.querySelectorAll<HTMLInputElement>(".checkboxRemove:checked");
      let projectsIdSelected: number[] = [];

      checkboxes.forEach(checkbox => {
          const row = checkbox.closest("tr");
          if (row) {
              const projectIdText = row.cells[0]?.textContent; // ID está na primeira célula
              if (projectIdText) {
                  projectsIdSelected.push(parseInt(projectIdText));
              }
          }
      });

      if (projectsIdSelected.length === 0) {
          alert("Selecione pelo menos um projeto para remover.");
          return;
      }

      for (const projectId of projectsIdSelected) {
        await axios.delete(`${API_BACKEND_URL}/projects/${projectId}`);
        console.log(`Projeto ${projectId} removido`);
      }
      
      // Atualiza a lista de projetos após a exclusão
      setProjects((prevProjects) => 
        prevProjects.filter(p => !projectsIdSelected.includes(Number.parseInt(p.id!)))
      );
      alert(`Projetos removidos: ${projectsIdSelected.join(', ')}`);

    } catch (err) {
      console.error('Erro ao deletar projetos:', err);
      if (axios.isAxiosError(err) && err.response) {
        alert(`Erro ao remover projetos: ${err.response.data?.message || err.message}`);
      } else {
        alert('Erro ao remover projetos.');
      }
    }
  };


  // --- Renderização Condicional ---
  if (showTableClients) {
    return (
      <div className="project-form">
        <h3>Selecione um cliente:</h3>
        <TableClientsForm 
          onClientSelected={handleClientSelected}
          ref={tableClientsRef} // Passe a ref para TableClientsForm
        />
        <button onClick={() => setShowTableClients(false)}>Voltar</button>
      </div>
    );
  }

  if (showTableStatus) {
    return (
      <div className="project-form">
        <h3>Selecione um status:</h3>
        <TableStatusForm 
          onStatusSelected={handleStatusSelected}
          ref={tableStatusRef} // Passe a ref para TableStatusForm
        />
        <button onClick={() => setShowTableStatus(false)}>Voltar</button>
      </div>
    );
  }

  if (showActivities) {
    return (
      <div className="project-form">
       <ActivityForm 
          activities={project.activities} 
          onActivitiesUpdated={updateActivities} // onActivitiesUpdated é o callback para updateActivities
        />
      </div>
    );
  }

  // --- Renderização do Formulário Principal e Tabela de Projetos ---
  return (
    <div className="project-form">
      <h2>Projeto</h2>
      <form onSubmit={submitForm}> {/* onSubmit para o form completo */}
        <div className="input-container">
          <label htmlFor="input-projectDesc">Descrição:</label>
          <input
            type="text"
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
            id="input-projectDesc"
          />
        </div>
        <div className="input-container">
          <label htmlFor="input-clientId">Cliente:</label>
          <input
            type="number"
            onKeyDown={blockSigns}
            onBlur={loadClient}
            min={0}
            value={project.client.id ?? ''} // Use ?? '' para lidar com null/undefined em inputs numéricos
            onChange={(e) =>
              setProject({
                ...project,
                client: { ...project.client, id: e.target.value /*? e.target.value : null*/ },
              })
            }
            id="input-clientId"
          />
          <button
            type="button"
            style={{ backgroundImage: `url(${searchIcon})` }}
            id="input-search"
            onClick={toggleTableClients} // Use onClick diretamente
          ></button>
          <input type="text" value={project.client.name} id="input-clientName" disabled />
        </div>
        <div className="input-container input-margin-top">
          <label htmlFor="input-statusId">Status:</label>
          <input
            type="number"
            onKeyDown={blockSigns}
            onBlur={loadStatus}
            min={0}
            value={project.status.id ?? ''} // Use ?? ''
            onChange={(e) =>
              setProject({
                ...project,
                status: { ...project.status, id: e.target.value /*? e.target.value : null*/ },
              })
            }
            id="input-statusId"
          />
          <button
            type="button" // Type 'button' para evitar submissão do form
            style={{ backgroundImage: `url(${searchIcon})` }}
            id="input-search"
            onClick={toggleTableStatus} // Use onClick diretamente
          ></button>
          <input type="text" value={project.status.description} id="input-statusDesc" disabled />
        </div>
        <div>
          <button type="button" onClick={() => setShowActivities(true)}>Atividades</button>
        </div>
        <button type="submit">Enviar</button> {/* Este botão submete o formulário */}
        <button type="button" onClick={clearForm}>Limpar</button>
      </form>

      {/* Seção de feedback do formulário */}
      {submitted && (
        <div className="form-message"> {/* Adicionei uma classe para o estilo de mensagem */}
          <h3>{!responseMessage ? 'Enviado com sucesso!' : 'Erro!'}</h3>
          {responseMessage && <p><strong>Detalhes:</strong> {responseMessage}</p>}
        </div>
      )}

      {/* Tabela de Projetos Cadastrados */}
      <div className="table-container">
        <h3>Cadastrados</h3>
        <table id="tableProjects">
          <thead>
            <tr>
              <th className="cursor-auto">ID</th>
              <th className="cursor-auto">Projeto</th>
              <th className="cursor-auto">Cliente</th>
              <th className="cursor-auto">Status</th>
              <th onClick={deleteProjectsSelected} style={{ backgroundImage: `url(${removeIcon})`}} className="remove-icon-cell"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((projectItem) => (
              <tr key={projectItem.id}>
                <td onClick={() => setProjectToForm(projectItem)}>{projectItem.id}</td>
                <td onClick={() => setProjectToForm(projectItem)}>{projectItem.description}</td>
                <td onClick={() => setProjectToForm(projectItem)}>
                  {projectItem.client.id} - {projectItem.client.name}
                </td>
                <td onClick={() => setProjectToForm(projectItem)}>
                  {projectItem.status.id} - {projectItem.status.description}
                </td>
                <td><input type="checkbox" className="checkboxRemove" /></td> {/* Renomeado para a classe CSS genérica */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectForm;