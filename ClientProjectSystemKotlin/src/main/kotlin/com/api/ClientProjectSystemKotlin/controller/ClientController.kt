package com.api.ClientProjectSystemKotlin.controller

import com.api.ClientProjectSystemKotlin.model.Client
import com.api.ClientProjectSystemKotlin.service.ClientService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/clients")
//@CrossOrigin(origins = "http://localhost:8080")
class ClientController {
    @Autowired
    private val clientService: ClientService? = null

    @GetMapping("{id}")
    fun getClientById(@PathVariable id: Int): Client {
        return clientService!!.findById(id)
    }

    @PostMapping
    fun createClient(@RequestBody client: Client): Client {
        clientService!!.saveOrUpdate(client)
        return client
    }

    @DeleteMapping("{id}")
    fun deleteById(@PathVariable id: Int) {
        clientService!!.deleteById(id)
    }

    @PutMapping("{id}")
    fun updateById(@PathVariable id: Int, @RequestParam name: String) {
        val client: Client = getClientById(id)
        client.name = name
        clientService!!.saveOrUpdate(client)
    }

    @GetMapping("/all")
    fun findAll(): List<Client> {
        return clientService!!.findAll()
    }
}