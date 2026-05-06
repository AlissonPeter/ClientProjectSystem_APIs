<template>
    <div class="clients-form">
      <h3>Cadastrados</h3>
      <table id="tableClients">
          <thead>
            <tr>
              <th class="cursor">ID</th>
              <th class="cursor">Cliente</th>
              <th :style="{ backgroundImage: `url(${removeIcon})`}" class="removeProject"  @click="deleteClientsSelected()"></th>
            </tr>
          </thead>
          <tbody>
        <tr v-for="client in clients" :key="client.id">
          <td @click="setClient(client.id, client.name)"> {{ client.id }}</td>
          <td @click="setClient(client.id, client.name)"> {{ client.name }}</td>
          <td ><input type="checkbox" class="checkboxRemove"></td>
        </tr>
    </tbody>
  </table>
    </div>
  </template>
  
  <script>
  import removeIcon from '@/assets/Icons/remove.png';
import axios from 'axios';
  export default {
    data() {
      return {
        clients: [],
        removeIcon,
        client: {
          id: null,
          name: '',
        },
        submitted: false,
        response: null,
      };
    },
    mounted() {
  this.getClients();
},
    methods: {
      async getClients() {
          try {
            const response = await axios.get('http://localhost:8081/clients/all');
            console.log('resposta do servidor', response.data);
            this.clients = response.data;
          } catch (error) {
            console.error('Erro ao buscar clientes:', error);
          }
      },
      clearForm() {
        this.client.id = null;
        this.client.name = '';
      },
      setClient(clientId, clientName) {
        this.client.id = clientId;
        this.client.name = clientName;
        console.log('client', this.client);
        this.$emit("client-selected", this.client);
      },
      async submitForm() {
        this.submitted = true;
      },
      async deleteClientsSelected() {
        try {
          let table = document.getElementById("tableClients"); // Seleciona apenas a tabela desejada
          let checkboxes = table.querySelectorAll(".checkboxRemove:checked"); // Pega apenas os selecionados na tabela
          let clientsIdSelected = [];
          checkboxes.forEach(checkbox => {
              let linha = checkbox.closest("tr"); // Pega a linha onde está o checkbox
              clientsIdSelected.push(parseInt(linha.cells[0].textContent));
          });
          for (let clientId of clientsIdSelected) {
            await axios.delete(`http://localhost:8081/clients/${clientId}`);
            console.log(`Client ${clientId} removed`);
          }
          this.getClients();
        } catch (error) {
          console.error('Error fetching clients:', error);
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
.clients-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  .client-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .client-form div {
    margin-bottom: 15px;
  }
  .client-form label {
    margin-bottom: 5px;
    display: block;
  }
  .client-form input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  .client-form button {
    padding: 10px 20px;
    background-color: #42b983;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .client-form button:hover {
    background-color: #359a72;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    background: #f4f4f4;
    margin: 5px 0;
    padding: 10px;
    border-radius: 4px;
  }
  </style>