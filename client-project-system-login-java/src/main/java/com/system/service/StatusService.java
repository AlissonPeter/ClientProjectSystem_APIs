package com.system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.system.model.Status;
import com.system.repository.StatusRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StatusService {

	@Autowired
	private StatusRepository statusRepository;

	@Transactional(readOnly = true)
	public Status findById(Integer id) {
		return statusRepository.findById(id)
		.orElseThrow(() -> new RuntimeException("Status not found"));
	}

	@Transactional
	public void saveOrUpdate(Status status) {
		statusRepository.save(status);
	}

	@Transactional(readOnly = true)
	public List<Status> findAll() {
		return statusRepository.findAll();
	}

	@Transactional
	public void deleteById(Integer id) {
		statusRepository.deleteById(id);
	}
}
