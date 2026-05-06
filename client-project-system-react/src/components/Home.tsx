import React, { useState, useMemo } from 'react';

import StatusForm from './status/StatusForm'; 
import ClientForm from './client/ClientForm';   
import ProjectForm from './project/ProjectForm'; 
import titleIcon from '@/assets/Icons/titulo.png'; 

const STATUS_FORM = 'StatusForm';
const CLIENT_FORM = 'clientForm';
const PROJECT_FORM = 'projectForm';

import './Home.css';

function Home() {
  
  const [currentForm, setCurrentForm] = useState<string>();
  
  const handleSetCurrentForm = (form: string) => {
    setCurrentForm(form);
  };

  
  const CurrentFormComponent = useMemo(() => {
    switch (currentForm) {
      case CLIENT_FORM:
        return ClientForm;
      case STATUS_FORM:
        return StatusForm;
      case PROJECT_FORM:
        return ProjectForm;
      default:
        return ClientForm;
    }
  }, [currentForm]);

  return (
    <div id="home-page"> 
      <h3 id="title" style={{ backgroundImage: `url(${titleIcon})` }}></h3>
      <div>
        <button onClick={() => handleSetCurrentForm(CLIENT_FORM)}>Cliente</button>
        <button onClick={() => handleSetCurrentForm(PROJECT_FORM)}>Projeto</button>
        <button onClick={() => handleSetCurrentForm(STATUS_FORM)}>Status</button>
      </div>
      <CurrentFormComponent />
    </div>
  );
};

export default Home;