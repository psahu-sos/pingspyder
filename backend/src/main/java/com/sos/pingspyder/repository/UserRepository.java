package com.sos.pingspyder.repository;

import com.sos.pingspyder.entity.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface UserRepository extends MongoRepository<UserEntity, String> {

    @Query("{ 'username' : ?0 }")
    Optional<UserEntity> findUserByUsername(String username);
}

