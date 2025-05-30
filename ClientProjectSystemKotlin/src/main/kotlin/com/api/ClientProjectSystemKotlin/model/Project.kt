package com.api.ClientProjectSystemKotlin.model

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany

@Entity
data class Project(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id : Int? = null,
    @Column(length = 150, nullable = false)
    var description : String? = "",
    @ManyToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "client_id", referencedColumnName = "id", nullable = false)
    var client : Client?,
    @Transient
    @OneToMany(mappedBy = "project", cascade = [CascadeType.ALL], orphanRemoval = true)
    var activities : List<Activity>?,
    @ManyToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "status_id", referencedColumnName = "id", nullable = false)
    var status : Status?
)
