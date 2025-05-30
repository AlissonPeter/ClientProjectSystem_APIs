package com.api.ClientProjectSystemKotlin.dto

import com.api.ClientProjectSystemKotlin.model.Activity


data class ProjectRequestDTO (
    var description: String,
    var clientId: Int? = null,
    var statusId: Int? = null,
    var activities: List<Activity>? = null
)
