package com.system.controller;

import java.util.List;

import com.system.config.RabbitMQConfig;
import com.system.model.Activity;
import com.system.service.ClientService;
import com.system.service.StatusService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.system.model.Project;
import com.system.service.ProjectService;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

	@Autowired
	private ProjectService projectService;
	@Autowired
	private StatusService statusService;
	@Autowired
	private ClientService clientService;
	@Autowired
	private RabbitTemplate rabbitTemplate;

	@GetMapping("{id}")
	public Project getProjectById(@PathVariable Integer id) {
		//project.setActivities(activityService.getByProjectId(id));
		return projectService.getProjectId(id);
	}
	
	@PostMapping
    public Project createProject(@RequestBody Project project) {
		try {
			project.setStatus(statusService.findById(project.getStatus().getId()));
			project.setClient(clientService.findById(project.getClient().getId()));
			insertActivitiesByProject(project);
			projectService.saveOrUpdate(project);
			return project;
		} catch (Exception e) {
			throw new RuntimeException("Erro ao criar o projeto: " + e.getMessage(), e);
		}
	}
	
	@PostMapping("/delete")
	public void deleteProjects(@RequestBody List<Integer> ids) {
		projectService.deleteProjects(ids);
	}

	private List<Activity> insertActivitiesByProject(Project project) {
		for (Activity activity : project.getActivities()) {
			activity.setId(null);
			activity.setProject(project);
			activity.setStatus(statusService.findById(activity.getStatus().getId()));
		}
		return project.getActivities();
	}
	
	@PutMapping
	public void updateById(@RequestBody Project projectUpdated) {
		final Project project = getProjectById(projectUpdated.getId());
		project.setDescription(projectUpdated.getDescription());
		project.setStatus(statusService.findById(projectUpdated.getStatus().getId()));
		project.setClient(clientService.findById(projectUpdated.getClient().getId()));
		project.getActivities().clear();
		//activityService.deleteByProjects(List.of(projectUpdated.getId()));
		project.getActivities().addAll(insertActivitiesByProject(projectUpdated));
		projectService.saveOrUpdate(project);
	}

	@PostMapping("/export")
	@ResponseStatus(HttpStatus.ACCEPTED) // Indica que o pedido foi aceito para processamento
	public void exportProjects(@RequestBody List<Integer> ids) {
		rabbitTemplate.convertAndSend(RabbitMQConfig.PROJECTS_SELECTED, ids);
	}

	@GetMapping("/all")
	public List<Project> findAll() {
		return projectService.findAll();
	}
}