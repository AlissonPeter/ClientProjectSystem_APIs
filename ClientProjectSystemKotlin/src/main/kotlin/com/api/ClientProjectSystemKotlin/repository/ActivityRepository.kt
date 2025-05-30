package com.api.ClientProjectSystemKotlin.repository

import com.api.ClientProjectSystemKotlin.model.Activity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface ActivityRepository : JpaRepository<Activity, Int> {

    @Query("SELECT a FROM Activity a WHERE a.project.id = :projectId")
    fun loadByProjectId(@Param("projectId") projectId: Int): List<Activity>
}