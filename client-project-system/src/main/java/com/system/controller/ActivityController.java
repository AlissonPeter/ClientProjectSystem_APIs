package com.system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.system.model.Activity;
import com.system.service.ActivityService;

@RestController
@RequestMapping("/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

	@Autowired
	private ActivityService activityService;

	@GetMapping("{id}")
	public Activity getActivityById(@PathVariable Integer id) {
		return activityService.findById(id);
	}


}