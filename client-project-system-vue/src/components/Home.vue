<template>
  <div id="app">
    <h3 id="title" :style="{ backgroundImage: `url(${titleIcon})`}"></h3>

    <div>
      <button @click="setCurrentForm(CLIENT_FORM)">Cliente</button>
      <button @click="setCurrentForm(PROJECT_FORM)">Projeto</button>
      <button @click="setCurrentForm(ACTIVITY_FORM)">Status</button>
    </div>

    <component 
      :is="currentFormComponent"
    ></component>
  </div>
</template>

<script>
import ActivityForm from './Status/StatusForm';
import ClientForm from './Client/ClientForm';
import ProjectForm from './Project/ProjectForm';
import titleIcon from '@/assets/Icons/titulo.png';

export default {
  data() {
    return {
      titleIcon,
      currentForm: this.PROJECT_FORM,   
      ACTIVITY_FORM: 'activityForm',
      CLIENT_FORM:'clientForm',
      PROJECT_FORM: 'projetForm' 
    };
  },
  methods: {
    setCurrentForm(form) {
      this.currentForm = form;
    }
  },
  computed: {
    currentFormComponent() {
      switch (this.currentForm) {
        case this.ACTIVITY_FORM:
          return ActivityForm;
        case this.CLIENT_FORM:
          return ClientForm;
        case this.PROJECT_FORM:
          return ProjectForm;
        default:
          return ClientForm;
      }
    }
  }
};
</script>

<style>
button {
    padding: 10px 20px;
    margin: 10px;
    background-color: #42b983;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
#app {
  font-family: Arial, sans-serif;
  text-align: center;
}
#title {
  background-size: contain; 
  background-repeat: no-repeat;
  background-position: center; 
  height: 106px; 
  width: 400px;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  margin-bottom: 20px;
  font-weight: bold;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
form {
  margin-top: 20px;
}
</style>
