package com.api.ClientProjectSystemKotlin.repository

import com.api.ClientProjectSystemKotlin.model.Client
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ClientRepository : JpaRepository<Client, Int> {
}