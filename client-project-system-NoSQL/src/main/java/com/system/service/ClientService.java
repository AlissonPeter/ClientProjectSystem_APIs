package com.system.service;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.system.model.Client;
import com.system.repository.ClientRepository;

@Service
public class ClientService {

	@Autowired
	private ClientRepository clientRepository;
	
	public Client findById(String id) {
		return clientRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Client not found"));
	}
	
	public void saveOrUpdate(Client client) {
		clientRepository.save(client);
	}
	
	public void deleteById(String id) {
		clientRepository.deleteById(id);
	}
	
	public List<Client> findAll() {
		return clientRepository.findAll();
	}
}
