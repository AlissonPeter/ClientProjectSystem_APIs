package com.system.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.system.model.Activity;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {

	 List<Activity> findByProjectId(String projectId);

	void deleteByProjectId(String projectId);
}
