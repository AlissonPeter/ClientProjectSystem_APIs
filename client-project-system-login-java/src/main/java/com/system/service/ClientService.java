package com.system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.system.model.Client;
import com.system.repository.ClientRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClientService {

	@Autowired
	private ClientRepository clientRepository;

	@Transactional(readOnly = true)
	public Client findById(Integer id) {
		return clientRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Client not found"));
	}

	@Transactional
	public void saveOrUpdate(Client client) {
		clientRepository.save(client);
	}

	@Transactional
	public void deleteById(Integer id) {
		clientRepository.deleteById(id);
	}

	@Transactional(readOnly = true)
	public List<Client> findAll() {
		return clientRepository.findAll();
	}
}
