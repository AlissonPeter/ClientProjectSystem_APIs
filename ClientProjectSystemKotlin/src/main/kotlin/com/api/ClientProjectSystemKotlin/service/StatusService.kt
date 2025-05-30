package com.api.ClientProjectSystemKotlin.service

import com.api.ClientProjectSystemKotlin.model.Status
import com.api.ClientProjectSystemKotlin.repository.StatusRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class StatusService {
    @Autowired
    private val statusRepository: StatusRepository? = null

    fun findById(id: Int?): Status {
        return statusRepository!!.findById(id!!)
            .orElseThrow {
                RuntimeException(
                    "Status not found"
                )
            }
    }

    fun saveOrUpdate(status: Status) {
        statusRepository!!.save<Status>(status)
    }
}