package com.api.ClientProjectSystemKotlin.controller

import com.api.ClientProjectSystemKotlin.model.Activity
import com.api.ClientProjectSystemKotlin.service.ActivityService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/activities")
class ActivityController {

    @Autowired
    lateinit var activityService: ActivityService

    @GetMapping("{id}")
    fun getActivityById(@PathVariable id: Int?): Activity {
        return activityService.findById(id!!)
    }
}