package com.system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.system.model.Client;
import com.system.service.ClientService;

@RestController
@RequestMapping("/clients")
@CrossOrigin(origins = "*")
public class ClientController {
	
	@Autowired
	private ClientService clientService;

	@GetMapping("{id}")
	public Client getClientById(@PathVariable Integer id) {
		return clientService.findById(id);
	}
	
	@PostMapping
	public Client createClient(@RequestBody Client client) {
		clientService.saveOrUpdate(client);
		return client;
	}
	
	@DeleteMapping("{id}")
	public void deleteById(@PathVariable Integer id) {
		clientService.deleteById(id);
	}
	
	@PutMapping("{id}")
	public void updateById(@PathVariable Integer id, @RequestParam String name) {
		final Client client = getClientById(id);
		client.setName(name);
		clientService.saveOrUpdate(client);
	}

	@GetMapping("/all")
	public List<Client> findAll() {
		return clientService.findAll();
	}
}