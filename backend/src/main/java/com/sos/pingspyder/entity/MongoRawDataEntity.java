package com.sos.pingspyder.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;

@Document(collection = "new_ping_data_3")
public class MongoRawDataEntity extends HashMap<String, Object> {

    @Id
    private String id;
}