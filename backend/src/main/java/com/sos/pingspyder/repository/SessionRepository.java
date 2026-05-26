package com.sos.pingspyder.repository;

import com.sos.pingspyder.entity.SessionEntity;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SessionRepository
        extends MongoRepository<SessionEntity, String> {

    Optional<SessionEntity> findByToken(String token);
}