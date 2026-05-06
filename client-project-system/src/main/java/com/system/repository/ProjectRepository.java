package com.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.system.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer>   {

}
