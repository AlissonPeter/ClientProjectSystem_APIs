package com.api.ClientProjectSystemKotlin.service

import com.api.ClientProjectSystemKotlin.dto.ProjectRequestDTO
import com.api.ClientProjectSystemKotlin.model.Activity
import com.api.ClientProjectSystemKotlin.model.Client
import com.api.ClientProjectSystemKotlin.model.Project
import com.api.ClientProjectSystemKotlin.model.Status
import com.api.ClientProjectSystemKotlin.repository.ProjectRepository

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.stream.Collectors

@Service
class ProjectService {
    @Autowired
    lateinit var projectRepository: ProjectRepository

    @Autowired
    lateinit var statusService: StatusService

    @Autowired
    lateinit var activityService: ActivityService

    @Autowired
    lateinit var clientService: ClientService

    fun getProjectId(id: Int): Project {
        val project = projectRepository.findById(id)
            .orElseThrow {
                RuntimeException(
                    "Project not found"
                )
            }
        return project
    }

    fun createProject(projectRequest: ProjectRequestDTO): Project? {
        try {
            val project = Project(null, "", null, null, null)

            project.description = projectRequest.description

            val client: Client = clientService.findById(projectRequest.clientId!!)
            project.client = client

            val statusProject: Status = statusService.findById(projectRequest.statusId)
            project.status = statusProject

            val savedProject = projectRepository.save(project)

            val activities: List<Activity?> = projectRequest.activities!!.stream().map { activity ->
                activity.project = savedProject
                val statusActivity: Status =
                    statusService.findById(activity.status.id)

                activity.status = statusActivity
                activity
            }.collect(Collectors.toList())

            activityService.saveAll(activities)

            return savedProject
        } catch (e: Exception) {
            e.printStackTrace()
            return null
        }
    }

    fun saveOrUpdate(project: Project) {
        projectRepository.save(project)
    }

    fun deleteById(id: Int) {
        projectRepository.deleteById(id)
    }

    fun findAll(): List<Project> {
        val projects = projectRepository.findAll()
        for (project in projects) {
            project.activities = activityService.getByProjectId(project.id!!)
        }
        return projects
    }
}