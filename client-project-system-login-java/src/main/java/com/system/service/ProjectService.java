package com.system.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import com.system.config.RabbitMQConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.system.model.Project;
import com.system.repository.ProjectRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {
	
	@Autowired
	private ProjectRepository projectRepository;
	@Autowired
	private ActivityService activityService;

	@Transactional(readOnly = true)
	public Project getProjectId(Integer id) {
		final Project project = projectRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Project not found"));
		return project;
	}

	@RabbitListener(queues = RabbitMQConfig.PROJECTS_SELECTED)
	public void processarMensagem(List<Integer> ids) {
		System.out.println("LOG: Exportanto lista de projetos: " + ids);
			try {
				// Simula um processamento pesado (ex: buscar no banco, formatar texto)
				Thread.sleep(5000);

				String fileName = "exportacao_projetos_" + System.currentTimeMillis() + ".txt";

				final String pathName = "exports";

				Path dirPath = Paths.get(pathName);

				//CRIA A PASTA (Se não existir, ele cria. Se já existir, não faz nada)
				Files.createDirectories(dirPath);

				//final List<Project> projects = findAll();

				// Escreve os IDs no arquivo
				Files.write(Paths.get(pathName + "/" + fileName), ("IDs exportados: " + ids.toString()).getBytes());

				System.out.println("LOG: Arquivo " + fileName + " gerado com sucesso!");
			} catch (Exception e) {
				System.err.println("Erro ao gerar arquivo: " + e.getMessage());
				// Se der erro aqui, o RabbitMQ pode tentar reenviar dependendo da sua config
			}
	}

	@Transactional
	public void saveOrUpdate(Project project) {
		projectRepository.save(project);
	}

	@Transactional
	public void deleteById(Integer id) {
		projectRepository.deleteById(id);
	}

	@Transactional
	public void deleteProjects(List<Integer> ids) {
		activityService.deleteByProjects(ids);
		projectRepository.deleteAllByIdIn(ids);
	}

	@Transactional(readOnly = true)
	public List<Project> findAll() {
		return projectRepository.findAllWithActivities();
	}
}
