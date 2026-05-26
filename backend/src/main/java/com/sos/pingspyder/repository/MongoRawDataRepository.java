package com.sos.pingspyder.repository;

import com.sos.pingspyder.entity.MongoRawDataEntity;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface MongoRawDataRepository extends MongoRepository<MongoRawDataEntity, String> {
}