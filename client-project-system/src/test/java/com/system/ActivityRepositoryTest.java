package com.system;

import com.system.model.Activity;
import com.system.model.Client;
import com.system.model.Project;
import com.system.model.Status;
import com.system.repository.ActivityRepository;
import com.system.repository.ClientRepository;
import com.system.repository.ProjectRepository;
import com.system.repository.StatusRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest // carrega somente os beans de persistência (JPA, Hibernate, Repositories)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ActivityRepositoryTest {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private StatusRepository statusRepository;

    private Project project;

    private Status status;

    @BeforeEach
    void setUp() {
        Client client = new Client();
        client.setName("João");
        clientRepository.save(client);

        status = new Status();
        status.setDescription("Ativo");
        status.setKind(0);
        statusRepository.save(status);

        project = new Project();
        project.setDescription("Projeto Teste");
        project.setClient(client);
        project.setStatus(status);
        project = projectRepository.save(project);
    }

    private List<Activity> getActivities() {

        final Activity activity1 = new Activity();
        activity1.setDescription("Atividade 1");
        activity1.setProject(project);
        activity1.setStatus(status);

        final Activity activity2 = new Activity();
        activity2.setDescription("Atividade 2");
        activity2.setProject(project);
        activity2.setStatus(status);

        return List.of(activity1, activity2);
    }

   @Test
    void loadByProjectId_shouldReturnActivitiesForProject() {
       final List<Activity> activities = getActivities();

       activityRepository.saveAll(activities);

        // 🔹 Executando a query customizada
        List<Activity> activitiesSaved = activityRepository.loadByProjectId(project.getId());

        // 🔹 Verificando o resultado
        assertThat(activitiesSaved).hasSize(2);
        assertThat(activitiesSaved).extracting(Activity::getDescription)
                .containsExactlyInAnyOrder("Atividade 1", "Atividade 2");
    }

    @Test
    @Transactional
    @Rollback
    void deleteByProjectId_shouldRemoveAllActivitiesForProject() {
        final List<Activity> activities = getActivities();

        activityRepository.saveAll(activities);

        // 🔹 Confirmando que a atividade foi salva
        assertThat(activityRepository.loadByProjectId(project.getId())).hasSize(2);

        // 🔹 Chamando o método customizado
        activityRepository.deleteByProjectId(project.getId());

        // 🔹 Agora não deve haver mais atividades
        List<Activity> remaining = activityRepository.loadByProjectId(project.getId());
        assertThat(remaining).isEmpty();
    }
}
