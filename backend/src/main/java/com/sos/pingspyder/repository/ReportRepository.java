package com.sos.pingspyder.repository;

import com.sos.pingspyder.entity.ReportEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReportRepository extends MongoRepository<ReportEntity, String> {

    List<ReportEntity> findByStretch(String stretch);
}