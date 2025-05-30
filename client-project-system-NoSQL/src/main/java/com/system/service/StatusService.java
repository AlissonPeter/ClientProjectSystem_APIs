package com.system.service;

import com.system.model.Status;
import com.system.repository.StatusRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatusService {

	@Autowired
	private StatusRepository statusRepository;
	
	public Status findById(String id) {
		return statusRepository.findById(id)
		.orElseThrow(() -> new RuntimeException("Status not found"));
	}
	
	public void saveOrUpdate(Status status) {
		statusRepository.save(status);
	}

	public List<Status> findAll() {
		return statusRepository.findAll();
	}

	public void deleteById(String id) {
		statusRepository.deleteById(id);
	}
}
