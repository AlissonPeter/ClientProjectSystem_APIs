<template>
  <div class="status-form">
    <h3>Cadastrados</h3>
    <table id="tableClients">
      <thead>
        <tr>
              <th class="cursor">ID</th>
              <th class="cursor">Descrição</th>
              <th class="cursor">Tipo</th>
              <th @click="deleteStatusSelected()" :style="{ backgroundImage: `url(${removeIcon})`}" class="removeProject"></th>
            </tr>
          </thead>
          <tbody>
      <tr v-for="status in statusList" :key="status.id">
        <td @click="setStatus(status)"> {{ status.id }}</td>
          <td @click="setStatus(status)"> {{ status.description }}</td>
          <td @click="setStatus(status)"> {{ status.kind + " - " + getKindDescription(status.kind) }}</td>
          <td ><input type="checkbox" class="checkboxRemove"></td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>

import axios from 'axios';
import removeIcon from '@/assets/Icons/remove.png';
import { KindEnum } from "./KindEnum";
  export default {
    data() {
      return {
        kinds: KindEnum.getOptions(),
        removeIcon,
        statusList: [],
        status: {
          id: null,
          description: '',
        },
        submitted: false,
        response: null
      };
    },
    mounted() {
      this.getStatus();
    },
    methods: {
      getKindDescription(kindId) {
      return KindEnum.getDescription(kindId); // Converte o ID para a descrição correspondente
    },
    async getStatus() {
        try {
          const response = await axios.get('http://localhost:8081/status/all');
          console.log('resposta do servidor', response.data);
          this.statusList = response.data;
        } catch (error) {
          console.log(error);
          console.error('Error fetching projects:', error);
        }
      },
      clearForm() {
        this.status.id = null;
        this.status.description = '';
      },
      setStatus(status) {
        this.status.id = status.id;
        this.status.description = status.description;
        this.status.kind = status.kind;
        this.$emit("status-selected", this.status);
        console.log('status', this.status);
      },
      async deleteStatusSelected() {
        try {
          let table = document.getElementById("tableClients"); // Seleciona apenas a tabela desejada
          let checkboxes = table.querySelectorAll(".checkboxRemove:checked"); // Pega apenas os selecionados na tabela
          let statusIdSelected = [];
          checkboxes.forEach(checkbox => {
              let linha = checkbox.closest("tr"); // Pega a linha onde está o checkbox
              statusIdSelected.push(parseInt(linha.cells[0].textContent));
          });
          for (let statusId of statusIdSelected) {
            await axios.delete(`http://localhost:8081/status/${statusId}`);
            this.$emit('status-deleted', statusId);
            console.log(`Status ${statusId} removed`);
          }
          this.getStatus();
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
th, td {
  padding: 10px;
  cursor: pointer;
  background-color: lightgray;
  border: 1px solid black;
}
.cursor {
  cursor: auto;
}
.removeProject {
  background-size: contain; 
  background-repeat: no-repeat;
  background-position: center; 
  height: 10px; 
  width: 10px;
}
.status-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.status-form div {
  margin-bottom: 15px;
}
.status-form label {
  margin-bottom: 5px;
  display: block;
}
.status-form input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.status-form button {
  padding: 10px 20px;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.status-form button:hover {
  background-color: #359a72;
}
</style>