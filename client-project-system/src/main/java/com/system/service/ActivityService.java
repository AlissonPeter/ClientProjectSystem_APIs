package com.system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.system.model.Activity;
import com.system.model.Project;
import com.system.repository.ActivityRepository;

import jakarta.transaction.Transactional;

@Service
public class ActivityService {
	@Autowired
	private ActivityRepository activityRepository;
	
	public void saveAll(List<Activity> activities) {
		activityRepository.saveAll(activities);
	}
	
	public Activity findById(Integer id) {
		return activityRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Activity not found"));
	}
	
	public List<Activity> getByProjectId(Integer projectId) {
		return activityRepository.loadByProjectId(projectId);
	}

	@Transactional
	public void deleteByProjectId(Integer projectId) {
		activityRepository.deleteByProjectId(projectId);
	}

	public void saveOrUpdate(List<Activity> activity) {
		activityRepository.saveAll(activity);
	}
}
