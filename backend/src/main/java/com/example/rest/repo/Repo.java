package com.example.rest.repo;

import java.util.Optional;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.rest.dto.Document;

@Repository
public interface Repo extends MongoRepository<Document, String> {

	Optional<Document> findByEmail(String email);

	Document findByClerkId(String clerkId);
}
