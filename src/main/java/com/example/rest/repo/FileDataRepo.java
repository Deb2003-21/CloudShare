package com.example.rest.repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.rest.dto.FileDataDoC;

@Repository
public interface FileDataRepo extends MongoRepository<FileDataDoC, String > {

	List<FileDataDoC> findByClerkId(String clerkId);
	Long countByClerkId(String clerkId);
}
