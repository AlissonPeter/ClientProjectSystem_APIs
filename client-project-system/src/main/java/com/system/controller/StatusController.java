package com.system.controller;

import com.system.model.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.system.model.Status;
import com.system.service.StatusService;

import java.util.List;

@RestController
@RequestMapping("/status")
@CrossOrigin(origins = "*")
public class StatusController {

	@Autowired
	private StatusService statusService;

	@GetMapping("{id}")
	public Status getStatusById(@PathVariable Integer id) {
		return statusService.findById(id);
	}
	
	@PostMapping
	public Status createStatus(@RequestBody Status status) {
		statusService.saveOrUpdate(status);
		return status;
	}

	@PutMapping("{id}")
	public void updateById(@PathVariable Integer id, @RequestParam String description, @RequestParam Integer kind) {
		final Status status = getStatusById(id);
		status.setDescription(description);
		status.setKind(kind);
		statusService.saveOrUpdate(status);
	}

	@GetMapping("/all")
	public List<Status> findAll() {
		return statusService.findAll();
	}

	@DeleteMapping("{id}")
	public void deleteById(@PathVariable Integer id) {
		statusService.deleteById(id);
	}
}
