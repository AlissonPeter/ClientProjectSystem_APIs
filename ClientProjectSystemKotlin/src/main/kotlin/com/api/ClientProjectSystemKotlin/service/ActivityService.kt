package com.api.ClientProjectSystemKotlin.service

import com.api.ClientProjectSystemKotlin.model.Activity
import com.api.ClientProjectSystemKotlin.repository.ActivityRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ActivityService {
    @Autowired
    private val activityRepository: ActivityRepository? = null

    fun saveAll(activities: List<Activity?>) {
        activityRepository!!.saveAll(activities)
    }

    fun findById(id: Int): Activity {
        return activityRepository!!.findById(id)
            .orElseThrow {
                RuntimeException(
                    "Activity not found"
                )
            }
    }

    fun getByProjectId(projectId: Int): List<Activity> {
        return activityRepository!!.loadByProjectId(projectId)
    }

    fun saveOrUpdate(activity: List<Activity?>) {
        activityRepository!!.saveAll(activity)
    }
}