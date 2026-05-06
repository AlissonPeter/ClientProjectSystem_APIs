package com.system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.system.model.Project;
import com.system.repository.ProjectRepository;

@Service
public class ProjectService {
	
	@Autowired
	private ProjectRepository projectRepository;
	@Autowired
	private StatusService statusService;
	@Autowired
	private ActivityService activityService;
	@Autowired
	private ClientService clientService;
	
	public Project getProjectId(Integer id) {
		final Project project = projectRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Project not found"));
		return project;
	}

	public void saveOrUpdate(Project project) {
		projectRepository.save(project);
	}
	
	public void deleteById(Integer id) {
		projectRepository.deleteById(id);
	}
	
	public List<Project> findAll() {
		final List<Project> projects = projectRepository.findAll();
		for (Project project : projects) {
			project.setActivities(activityService.getByProjectId(project.getId()));
		}
		return projects;
	}
}
