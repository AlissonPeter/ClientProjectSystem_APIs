package com.system.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.system.model.Client;

@Repository
public interface ClientRepository extends MongoRepository<Client, String> {

}
