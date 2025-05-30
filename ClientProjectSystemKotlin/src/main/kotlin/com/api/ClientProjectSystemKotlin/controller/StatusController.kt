package com.api.ClientProjectSystemKotlin.controller

import com.api.ClientProjectSystemKotlin.model.Status
import com.api.ClientProjectSystemKotlin.service.StatusService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/status")
class StatusController {

    @Autowired
    lateinit var statusController: StatusService

    @GetMapping("{id}")
    fun getStatusById(@PathVariable id: Int?): Status {
        return statusController.findById(id)
    }

    @PostMapping
    fun createStatus(@RequestBody status: Status?) {
        statusController.saveOrUpdate(status!!)
    }
}