<template>
    <div class="client-form">
      <h2>Cliente</h2>

      <form>
        <div>
          <label for="name">Nome:</label>
          <input type="text" v-model="client.name" id="name" />
        </div>
      </form>
      <button type="submit" @click.prevent="submitForm">Enviar</button>
      <button @click.prevent="clearForm">Limpar</button>
  
      <div v-if="submitted">
        <h3>Enviado com sucesso!</h3>
        <p v-if="response"><strong>Resposta Servidor:</strong> {{ response }}</p>
      </div>
      <tableClients ref="tableClients" @client-selected="handleSelected" />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import tableClients from './TableClientsForm';
  
  export default {
    components: {
      tableClients,
    },
    data() {
      return {
        client: {
          id: null,
          name: '',
        },
        submitted: false,
        response: null,
      };
    },
    methods: {
      handleSelected(clientSelected) {
      this.client = clientSelected;
    },
      clearForm() {
        this.client.id = null;
        this.client.name = '';
      },
      setClient(clientId, clientName) {
        this.client.id = clientId;
        this.client.name = clientName;
        console.log('client', this.client);
      },
      async submitForm() {
        this.submitted = true;
        try {
          if (this.client.id === null) {
            console.log('Create new client');
            const response = await axios.post(`http://localhost:8081/clients`, this.client);
          } else {
            console.log('Update client:', this.client.id);
            await axios.put(`http://localhost:8081/clients/${this.client.id}?name=${this.client.name}`);
          }
          // Atualizar lista de clientes chamando o método dentro do ref
        this.$nextTick(() => {
          if (this.$refs.tableClients) {
            this.$refs.tableClients.getClients();
          }
        });
          // Após 3 segundos, esconde a mensagem
        setTimeout(() => {
          this.submitted = false;
        }, 3000); // 3000ms = 3 segundos
          this.clearForm();
        } catch (error) {
          console.error('An error occurred:', error);
          this.response = 'Erro na requisição';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  
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