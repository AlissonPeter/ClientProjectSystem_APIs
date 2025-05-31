<template>
  <div v-if="showTableStatus" @activities="getActivities">
    <h3>Selecione um status:</h3>
      <TableStatusForm 
      @status-selected="handleStatusSelected"
      />
      <button v-if="showTableStatus" @click="showTableStatus = false">Voltar</button>
  </div>
  <div v-if=" !showTableStatus">
  <h2>Atividade</h2>
    <form>
        <div class="input-container">
          <label for="name">Descrição:</label>
          <input type="text" v-model="activity.description" id="input-projectDesc" />
        </div>
        <div class="input-container">
          <label for="name">Status:</label>
          <input type="number" @keydown="blockSigns" @blur="loadStatus" min="0" v-model="activity.status.id" id="input-statusId"/>
          <button type="search" :style="{ backgroundImage: `url(${searchIcon})` }" id= "input-search" @click.prevent="toggleTableStatus"></button>
          <input type="text" v-model="activity.status.description" id="input-statusDesc" disabled />
        </div>
        <div>
          <button type="submit" @click.prevent="clearForm">Limpar</button>
        </div>
        <button type="submit" @click.prevent="submitForm">Enviar</button>
        <button type="submit" @click.prevent="backProject">Voltar</button>
      </form>

      <div v-if="submitted">
        <h3>Enviado</h3>
        <p v-if="response"><strong>Resposta Servidor:</strong> {{ response }}</p>
      </div>
      <div class="project-form">
        <h3>Cadastrados</h3>
        <table id="tableProjects">
          <thead>
            <tr>
              <th class="cursor">Descrição</th>
              <th class="cursor">Status</th>
              <th @click="deleteActivitiesSelected()" :style="{ backgroundImage: `url(${removeIcon})`}" class="removeProject"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(activity, index) in localActivities" :key="activity.id">
              <td @click="setActivity(activity, index)">{{activity.description}}</td>
               <td @click="setActivity(activity, index)">{{ activity.status.id }} - {{ activity.status.description }}</td>
              <td ><input type="checkbox" class="checkboxRemove" @click="toggleSelection($event, index)" :checked="activitiesChecked.includes(index)"></td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
</template>

<script>

import axios from 'axios';
import searchIcon from '@/assets/Icons/search.png';
import removeIcon from '@/assets/Icons/remove.png';
import TableStatusForm from "../../Status/TableStatusForm.vue";

  export default {
    components: {
      TableStatusForm
    },
    props: {
      activities: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        localActivities: [], // Cria uma cópia local para edição
        showTableStatus: false,
        searchIcon,
        removeIcon,
        activityIndex: null,
        activitiesChecked:[],
        activity: {
          id: null,
          description: '',
            status: {
            id: null,
            description: ''
          }
        },
        submitted: false,
        response: null,
      };
    },
    watch: {
      activities: {
        handler(newActivities) {
          this.localActivities = [...newActivities]; // Atualiza quando receber dados
        },
        immediate: true, // Executa logo na inicialização
        deep: true // Detecta alterações em objetos dentro do array
      },
    },
    methods: {
      toggleTableStatus(event) {
        //event.preventDefault(); // Impede comportamento padrão
        this.showTableStatus = true;
      },
    handleStatusSelected(status) {
      this.activity.status.id = status.id;
      this.activity.status.description = status.description;
      this.showTableStatus = false; // Fecha a tabela após a seleção
    },
      blockSigns(event) {
        if (event.key === "-" || event.key === "+" ) {
          event.preventDefault(); // Impede a entrada do caractere
        }
      },
      clearForm() {
        Object.assign(this.activity, { id: null, description: "", status: { id: null, description: "" } });
      },
      backProject() {
        this.$emit("activities", this.localActivities);
      },
      setActivity(activity, index) {
        this.activityIndex = index;
        this.activity.id = activity.id;
        this.activity.description = activity.description;
        this.handleStatusSelected(activity.status);
        console.log('project', this.activity);
      },
      toggleSelection(event, index) {
        const isChecked = event.target.checked; // Verifica se está selecionado
        if (isChecked) {
          this.activitiesChecked.push(index);
        } else {
          this.activitiesChecked = this.activitiesChecked.filter(item => item !== index);
        }
      },
      async loadStatus() {
        try {
          console.log('Load status');
          const response = await axios.get(`http://localhost:8081/status/${this.activity.status.id}`);
          this.handleStatusSelected(response.data);
        } catch (error) {
          console.error('An error occurred:', error);
          this.response = 'Erro ao buscar o status';
        }
      }, async submitForm(event) {
        //event.preventDefault();
        this.submitted = true;
        try {
          if (this.activityIndex === null) {
            console.log('Create new project');
            this.localActivities.push({ ...this.activity });
          } else {
              this.localActivities[this.activityIndex] = { ...this.activity }; // Atualiza a atividade correta
          }
          this.clearForm();
        } catch (error) {
          console.error('An error occurred:', error);
          this.response = 'Erro na requisição';
        }
      },
      async deleteActivitiesSelected() {
        try {
          this.localActivities = this.localActivities.filter((_, index) => !this.activitiesChecked.includes(index));
          this.activitiesChecked = [];
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