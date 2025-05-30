package com.api.ClientProjectSystemKotlin.controller

import com.api.ClientProjectSystemKotlin.dto.ProjectRequestDTO
import com.api.ClientProjectSystemKotlin.model.Project
import com.api.ClientProjectSystemKotlin.service.ActivityService
import com.api.ClientProjectSystemKotlin.service.ProjectService

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/projects")
class ProjectController(@Autowired
                        private val activityService: ActivityService,
                        @Autowired
                        private val projectService: ProjectService) {

    @GetMapping("{id}")
    fun getProjectById(@PathVariable id: Int): Project {
        val project = projectService.getProjectId(id)
        project.activities = activityService.getByProjectId(id)
        return project
    }

    @PostMapping
    fun createProject(@RequestBody projectRequestDTO: ProjectRequestDTO?): Project? {
        val project = projectService.createProject(projectRequestDTO!!)
        return project
    }

    @DeleteMapping("{id}")
    fun deleteById(@PathVariable id: Int) {
        projectService.deleteById(id)
    }

    @PutMapping("{id}")
    fun updateById(@PathVariable id: Int, @RequestParam description: String) {
        val project = getProjectById(id)
        project.description = description
        projectService.saveOrUpdate(project)
    }

    @GetMapping("/all")
    fun findAll(): List<Project> {
        return projectService.findAll()
    }
}