package com.api.ClientProjectSystemKotlin.repository

import com.api.ClientProjectSystemKotlin.model.Client
import com.api.ClientProjectSystemKotlin.model.Status
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface StatusRepository : JpaRepository<Status, Int> {
}