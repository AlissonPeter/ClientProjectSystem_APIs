<template>

  <div v-if="showTableClients" class="project-form">
    <h3>Selecione um cliente:</h3>
      <TableClientsForm 
      @client-selected="handleClientSelected"
      />
      <button v-if="showTableClients" @click="showTableClients = false">Voltar</button>
  </div>

  <div v-if="showTableStatus" class="project-form">
    <h3>Selecione um status:</h3>
      <TableStatusForm 
      @status-selected="handleStatusSelected"
      />
      <button v-if="showTableStatus" @click="showTableStatus = false">Voltar</button>
  </div>
  
  <div v-if="showActivities" class="project-form">
      <ActivityForm :activities="project.activities" @activities="updateActivities"
      />
  </div>

  <div v-if="!showTableClients && !showTableStatus && !showActivities" class="project-form">
  <h2>Projeto</h2>
    <form>
        <div class="input-container">
          <label for="name">Descrição:</label>
          <input type="text" v-model="project.description" id="input-projectDesc" />
        </div>
        <div class="input-container">
          <label for="name">Cliente:</label>
          <input type="number" @keydown="blockSigns" @blur="loadClient" min="0" v-model="project.client.id" id="input-clientId"/>
          <button type="button" :style="{ backgroundImage: `url(${searchIcon})` }" id= "input-search" @click.prevent="toggleTableClients"></button>
          <input type="text" v-model="project.client.name" id="input-clientName" disabled />
        </div>
        <div class="input-container">
          <label for="name">Status:</label>
          <input type="number" @keydown="blockSigns" @blur="loadStatus" min="0" v-model="project.status.id" id="input-statusId"/>
          <button type="search" :style="{ backgroundImage: `url(${searchIcon})` }" id= "input-search" @click.prevent="toggleTableStatus"></button>
          <input type="text" v-model="project.status.description" id="input-statusDesc" disabled />
        </div>
        <div>
        <button type="submit" @click.prevent="showActivities = true">Atividades</button>
      </div>
        <button type="submit" @click.prevent="submitForm">Enviar</button>
        <button type="submit" @click.prevent="clearForm">Limpar</button>
      </form>

      <div v-if="submitted">
        <h3 v-if="!response">Enviado com sucesso!</h3>
        <p v-if="response"><strong>Resposta Servidor:</strong> {{ response }}</p>
      </div>
      <div class="project-form">
        <h3>Cadastrados</h3>
        <table id="tableProjects">
          <thead>
            <tr>
              <th class="cursor">ID</th>
              <th class="cursor">Projeto</th>
              <th class="cursor">Cliente</th>
              <th class="cursor">Status</th>
              <th @click="deleteProjectsSelected()" :style="{ backgroundImage: `url(${removeIcon})`}" class="removeProject"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.id">
              <td @click="setProject(project)">{{project.id}}</td>
              <td @click="setProject(project)">{{project.description}}</td>
              <td  @click="setProject(project)" >{{ project.client.id }} - {{ project.client.name }}</td>
               <td @click="setProject(project)">{{ project.status.id }} - {{ project.status.description }}</td>
              <td ><input type="checkbox" class="checkboxRemove"></td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
</template>

<script>

import removeIcon from '@/assets/Icons/remove.png';
import searchIcon from '@/assets/Icons/search.png';
import axios from 'axios';
import TableClientsForm from "../Client/TableClientsForm.vue";
import TableStatusForm from "../Status/TableStatusForm.vue";
import ActivityForm from "./Activity/ActivityForm.vue";

  export default {
    components: {
      TableClientsForm,
      TableStatusForm,
      ActivityForm
    },
    data() {
      return {
        showTableClients: false, // Controla a exibição da tabela
        showTableStatus: false,
        showActivities: false,
        searchIcon,
        removeIcon,
        project: {
          id: null,
          description: '',
          activities: [],
          status: {
            id: null,
            description: ''
          },
          client: {
            id: null,
            name: ''
          }
        },
        projects: [],
        submitted: false,
        response: null,
      };
    },
    mounted() {
      this.getProjects();
    },
    methods: {
      updateActivities(newActivities) {
        this.project.activities = [...newActivities];
        this.showActivities = false;
      },
      toggleTableClients(event) {
        event.preventDefault(); // Impede comportamento padrão
        this.showTableClients = true;
      },
      toggleTableStatus(event) {
        event.preventDefault(); // Impede comportamento padrão
        this.showTableStatus = true;
      },
      handleClientSelected(client) {
        this.project.client.id = client.id;
        this.project.client.name = client.name;
      this.showTableClients = false; // Fecha a tabela após a seleção
    },
    handleStatusSelected(status) {
      this.project.status.id = status.id;
      this.project.status.description = status.description;
      this.showTableStatus = false; // Fecha a tabela após a seleção
    },
      blockSigns(event) {
        if (event.key === "-" || event.key === "+" ) {
          event.preventDefault(); // Impede a entrada do caractere
        }
      },
      clearForm() {
        Object.assign(this.project, {
          id: null, 
          description: '', 
          client: {
            id: null, 
            name: '',
          },
          status: {
            id: null,
            description: ''
          }
        });
      },
      setProject(project) {
        this.project.id = project.id;
        this.project.description = project.description;
        this.setStatusProject(project.status.id, project.status.description)
        this.setClientProject(project.client.id, project.client.name)
        this.project.activities = project.activities;
        console.log('project', this.project);
      },
      setStatusProject(statusId, description) {
        this.project.status.id = statusId;
        this.project.status.description = description;
        console.log('status', this.status);
      },
      setClientProject(clientId, name) {
        this.project.client.id = clientId;
        this.project.client.name = name;
      },
      async loadStatus() {
        try {
          console.log('Load status');
          const response = await axios.get(`http://localhost:8081/status/${this.project.status.id}`);
          this.setStatusProject(response.data.id, response.data.description);
        } catch (error) {
          console.error('An error occurred:', error);
          this.response = 'Erro ao buscar o status';
          this.project.status.id = null;
          this.project.status.description = '';
        }
      },async loadClient() {
        try {
          console.log('Load Client');
          const response = await axios.get(`http://localhost:8081/clients/${this.project.client.id}`);
          this.setClientProject(response.data.id, response.data.name);
        } catch (error) {
          console.error('An error occurred:', error);
          this.response = 'Erro ao buscar o cliente';
          this.project.client.id = null;
          this.project.client.name = '';
        }
      }, async submitForm(event) {
        event.preventDefault();
        this.submitted = true;
        try {
          if (this.project.id === null) {
            console.log('Create new project');
            const response = await axios.post(`http://localhost:8081/projects`, this.project);
            this.projects.push(response.data);
          } else {
            console.log('Update client:', this.project.id);
            const response = await axios.put(`http://localhost:8081/projects`, this.project);
            const projectIndex = this.projects.findIndex(project => project.id === this.project.id);
            this.projects[projectIndex].description = this.project.description;
            this.projects[projectIndex].status = this.project.status;
            this.projects[projectIndex].client = this.project.client;
            this.projects[projectIndex].activities = this.project.activities;
          }
          this.clearForm();
        } catch (error) {
          console.error('An error occurred:', error);
          this.response = 'Erro na requisição';
        }
        setTimeout(() => {
            this.submitted = false;
          }, 3000);
      },
      async getProjects() {
        try {
          const response = await axios.get('http://localhost:8081/projects/all');
          console.log('resposta do servidor', response.data);
          this.projects = response.data;
        } catch (error) {
          console.log(error);
          console.error('Error fetching projects:', error);
        }
      },
     
      async deleteProjectsSelected() {
        try {
          let table = document.getElementById("tableProjects"); // Seleciona apenas a tabela desejada
          let checkboxes = table.querySelectorAll(".checkboxRemove:checked"); // Pega apenas os selecionados na tabela
          let projectsIdSelected = [];
          checkboxes.forEach(checkbox => {
              let linha = checkbox.closest("tr"); // Pega a linha onde está o checkbox
              projectsIdSelected.push(parseInt(linha.cells[0].textContent));
          });
          for (let projectId of projectsIdSelected) {
            await axios.delete(`http://localhost:8081/projects/${projectId}`);
            this.projects = this.projects.filter(project => project.id !== projectId);
            console.log(`Project ${projectId} removed`);
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
    },
  };

</script>

<style scoped>
 table {
  width: 100%; /* Define uma largura para a tabela */
  margin: 0 auto; /* Centraliza horizontalmente */
  border-collapse: collapse;
  margin-top: 0px;
}
.removeProject {
  background-size: contain; 
  background-repeat: no-repeat;
  background-position: center; 
  height: 10px; 
  width: 10px;
}
.input-container input, .input-container button {
  margin: 0;
}
.column {
  width: 200px; /* Largura fixa para cada coluna */
  padding: 10px;
  background-color: #42b983;
}
.cursor {
  cursor: auto;
}
th, td {
  padding: 10px;
  cursor: pointer;
  background-color: lightgray;
  border: 1px solid black;
}
.project-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.project-form div {
  margin-bottom: 15px;
}
.project-form label {
  margin-bottom: 5px;
  display: block;
  justify-content: flex-end; /* Alinha tudo à direita */
}
/*.project-form input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}*/
.input-container {
  display: flex;
  justify-content: center;
  align-items: center; /* Alinha os itens verticalmente */
  gap: 5px; /* Define um pequeno espaço entre os elementos */
}
.input-container label {
  width: 80px; /* Define uma largura fixa para alinhar */
  text-align: right; /* Garante que o texto fique alinhado à direita */
}
#input-clientId, #input-statusId {
  width: 50px; /* Garante um tamanho mínimo */
  text-align: center; /* Centraliza o texto */
}
#input-statusDesc {
  width: 150px;
  height: 15px;
}
#input-clientName {
  width: 150px;
  height: 15px;
}
#input-projectDesc {
  width: 245px;
  height: 15px;
}
#input-search {
  padding: 10px 10px;
  background-size: 20px 20px;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.project-form button {
  padding: 10px 20px;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.project-form button:hover {
  background-color: #359a72;
}
</style>