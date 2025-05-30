package com.system.configdb;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoCollectionInitializer {

    @Autowired
    private MongoTemplate mongoTemplate;

    @PostConstruct
    public void initCollections() {
        if (!mongoTemplate.collectionExists("client")) {
            mongoTemplate.createCollection("client");
        }
        if (!mongoTemplate.collectionExists("project")) {
            mongoTemplate.createCollection("project");
        }
        if (!mongoTemplate.collectionExists("activity")) {
            mongoTemplate.createCollection("activity");
        }
        if (!mongoTemplate.collectionExists("status")) {
            mongoTemplate.createCollection("status");
        }
    }
}
