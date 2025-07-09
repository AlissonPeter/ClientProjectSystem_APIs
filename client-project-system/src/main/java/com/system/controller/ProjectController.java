package com.system.controller;

import java.util.List;

import com.system.model.Activity;
import com.system.service.ClientService;
import com.system.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.system.model.Project;
import com.system.service.ActivityService;
import com.system.service.ProjectService;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

	@Autowired
	private ActivityService activityService;
	@Autowired
	private ProjectService projectService;
	@Autowired
	private StatusService statusService;
	@Autowired
	private ClientService clientService;

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
			projectService.saveOrUpdate(project);
			insertActivitiesByProject(project);
			return project;
		} catch (Exception e) {
			throw new RuntimeException("Erro ao criar o projeto: " + e.getMessage(), e);
		}
	}
	
	@DeleteMapping("{id}")
	public void deleteById(@PathVariable Integer id) {
		activityService.deleteByProjectId(id);
		projectService.deleteById(id);
	}

	private void insertActivitiesByProject(Project project) {
		for (Activity activity : project.getActivities()) {
			activity.setProject(project);
			activity.setStatus(statusService.findById(activity.getStatus().getId()));
		}
		activityService.saveAll(project.getActivities());
	}
	
	@PutMapping
	public void updateById(@RequestBody Project projectUpdated) {
		final Project project = getProjectById(projectUpdated.getId());
		project.setDescription(projectUpdated.getDescription());
		project.setStatus(statusService.findById(projectUpdated.getStatus().getId()));
		project.setClient(clientService.findById(projectUpdated.getClient().getId()));
		project.setActivities(projectUpdated.getActivities());
		activityService.deleteByProjectId(projectUpdated.getId());
		insertActivitiesByProject(project);
		projectService.saveOrUpdate(project);
	}

	

	@GetMapping("/all")
	public List<Project> findAll() {
		return projectService.findAll();
	}
}
