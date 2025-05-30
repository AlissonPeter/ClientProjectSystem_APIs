package com.system.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.system.model.Project;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String>   {

}
