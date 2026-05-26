package com.sos.pingspyder.util;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.sos.pingspyder.exception.MongoFetchException;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MongoHelper {

    private final MongoClient mongoClient;
    private final ProjectResolverHelper projectResolverHelper;

    // collection name in Mongo DB
    public MongoCollection<Document> getCollection(String project) {

        String dbName = projectResolverHelper.resolveDatabase(project);
        String collectionName = projectResolverHelper.resolveCollection(project);
        MongoDatabase db = mongoClient.getDatabase(dbName);

        return db.getCollection(collectionName);
    }

    // get latest run ID
    public String getLatestRunId(List<Document> docs) {

        return docs.stream()
                .max(Comparator.comparing(d -> {
                    Date dt = d.getDate("lastUpdated");

                    return dt != null ? dt : new Date(0);
                }))
                .orElseThrow(() -> new MongoFetchException("Unable to determine latest run"))
                .getString("runId");
    }
}
