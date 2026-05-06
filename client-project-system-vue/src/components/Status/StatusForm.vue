<template>
  <div class="status-form">
    <h2>Status</h2>
    <form>
        <div>
          <label for="name">Descrição:</label>
          <input type="text" v-model="status.description" id="input-statusDesc" />
          <label for="name">Tipo:</label>
          <select v-model="status.kind" id="kind">
            <option v-for="kind in kinds" :key="kind.id" :value="kind.id">
              {{ kind.description }}
            </option>
          </select>
        </div>
        <button @click.prevent="submitForm">Enviar</button>
        <button @click.prevent="clearForm">Limpar</button>
    </form>

    <div v-if="submitted">
        <h3>Enviado com sucesso!</h3>
        <p v-if="response"><strong>Resposta Servidor:</strong> {{ response }}</p>
      </div>
      <tableStatus ref="tableStatus" @status-selected="handleSelected" />
  </div>
</template>

<script>

import axios from 'axios';
import tableStatus from './TableStatusForm';
import { KindEnum } from "./KindEnum";
  
  export default {
    components: {
      tableStatus,
    },
    data() {
      return {
        //kindSelected: null,
        kinds: KindEnum.getOptions(),
        status: {
          id: null,
          description: '',
          kind: null
        },
        submitted: false,
        response: null
      };
    },
    methods: {
      handleSelected(statusSelected) {
      this.status = statusSelected;
    },
      clearForm() {
        this.status.id = null;
        this.status.description = '';
        this.status.kind = null;
      },
      setStatus(status) {
        this.status.id = status.id;
        this.status.description = status.description;
        this.status.kind = status.kind;
        console.log('status', this.status);
      },
      async submitForm() {
        this.submitted = true;
        try {
          if (this.status.id === null) {
            console.log('Create new status');
            const response = await axios.post(`http://localhost:8081/status`, this.status);
          } else {
            console.log('Update status:', this.status.id);
            await axios.put(`http://localhost:8081/status/${this.status.id}?description=${this.status.description}&kind=${this.status.kind}`);
          }
           // Atualizar lista de clientes chamando o método dentro do ref
          this.$nextTick(() => {
            if (this.$refs.tableStatus) {
              this.$refs.tableStatus.getStatus();
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
#input-statusDesc {
  width: 200px;
  height: 15px;
}
</style>