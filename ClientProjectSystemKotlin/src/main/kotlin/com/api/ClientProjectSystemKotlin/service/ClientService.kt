package com.api.ClientProjectSystemKotlin.service

import com.api.ClientProjectSystemKotlin.model.Client
import com.api.ClientProjectSystemKotlin.repository.ClientRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ClientService {

    @Autowired
    private val clientRepository: ClientRepository? = null

    fun findById(id: Int): Client {
        return clientRepository!!.findById(id)
            .orElseThrow {
                RuntimeException(
                    "Client not found"
                )
            }
    }

    fun saveOrUpdate(client: Client) {
        clientRepository!!.save<Client>(client)
    }

    fun deleteById(id: Int) {
        clientRepository!!.deleteById(id)
    }

    fun findAll(): List<Client> {
        return clientRepository!!.findAll()
    }
}