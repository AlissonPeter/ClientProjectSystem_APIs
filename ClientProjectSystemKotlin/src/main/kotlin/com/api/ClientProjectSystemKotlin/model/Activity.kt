package com.api.ClientProjectSystemKotlin.model

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne

@Entity
data class Activity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id : Int? = null,
    @Column(length = 100, nullable = false)
    var description : String,
    @ManyToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "project_id", referencedColumnName = "id", nullable = false)
    var project : Project,
    @ManyToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "status_id", referencedColumnName = "id", nullable = false)
    var status : Status
)
