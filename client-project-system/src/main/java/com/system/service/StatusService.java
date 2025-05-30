package com.system.service;

import com.system.model.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.system.model.Status;
import com.system.repository.StatusRepository;

import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class StatusService {

	@Autowired
	private StatusRepository statusRepository;
	
	public Status findById(Integer id) {
		return statusRepository.findById(id)
		.orElseThrow(() -> new RuntimeException("Status not found"));
	}
	
	public void saveOrUpdate(Status status) {
		statusRepository.save(status);
	}

	public List<Status> findAll() {
		return statusRepository.findAll();
	}

	public void deleteById(Integer id) {
		statusRepository.deleteById(id);
	}
}
