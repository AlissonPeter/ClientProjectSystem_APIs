package com.system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.system.model.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer>{

	 @Query("SELECT a FROM Activity a WHERE a.project.id = :projectId")
	 List<Activity> loadByProjectId(@Param("projectId") Integer projectId);

	@Modifying
	void deleteAllByProjectIdIn(List<Integer> ids);
}
