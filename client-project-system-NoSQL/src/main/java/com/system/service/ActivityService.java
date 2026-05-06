package com.system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.system.model.Activity;
import com.system.repository.ActivityRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ActivityService {
	@Autowired
	private ActivityRepository activityRepository;

	@Autowired
	private StatusService statusService;

	public void saveAll(List<Activity> activities) {
		activityRepository.saveAll(activities);
	}
	
	public Activity findById(String id) {
		return activityRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Activity not found"));
	}
	
	public List<Activity> getByProjectId(String projectId) {
		final List<Activity> listActivities = activityRepository.findByProjectId(projectId);
		for (Activity activity : listActivities) {
			activity.setStatus(statusService.findById(activity.getStatusId()));
		}
		return listActivities;
	}

	@Transactional
	public void deleteByProjectId(String projectId) {
		activityRepository.deleteByProjectId(projectId);
	}

	public void saveOrUpdate(List<Activity> activity) {
		activityRepository.saveAll(activity);
	}
}
