package com.system.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.system.model.Project;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer>   {

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.activities")
    List<Project> findAllWithActivities();

    @Modifying
    void deleteAllByIdIn(List<Integer> ids);
}
