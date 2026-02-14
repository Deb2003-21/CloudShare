package com.example.rest.repo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.rest.dto.userCredits;

public interface UserCreditRepo extends MongoRepository<userCredits, String> {

	  Optional<userCredits> findByClerkId(String clerkId);
}
