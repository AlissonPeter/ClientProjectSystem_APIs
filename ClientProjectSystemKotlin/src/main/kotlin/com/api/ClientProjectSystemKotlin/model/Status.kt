package com.api.ClientProjectSystemKotlin.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class Status(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id : Int? = null,
    @Column(length = 100, nullable = false)
    var description : String,
    @Column(length = 1, nullable = false, unique = true)
    var kind : Int
)
