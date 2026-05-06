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

	@Transactional
	public void saveAll(List<Activity> activities) {
		activityRepository.saveAll(activities);
	}

	@Transactional(readOnly = true)
	public Activity findById(Integer id) {
		return activityRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Activity not found"));
	}

	@Transactional(readOnly = true)
	public List<Activity> getByProjectId(Integer projectId) {
		return activityRepository.loadByProjectId(projectId);
	}

	@Transactional
	public void deleteByProjects(List<Integer> ids) {
		activityRepository.deleteAllByProjectIdIn(ids);
	}

	@Transactional
	public void saveOrUpdate(List<Activity> activity) {
		activityRepository.saveAll(activity);
	}
}
