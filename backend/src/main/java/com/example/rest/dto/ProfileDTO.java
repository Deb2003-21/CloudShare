package com.example.rest.dto;

import java.time.Instant;


public class ProfileDTO {

	
	private String id;
	private String clerkId;
	private String email;
	private String firstName;
	private String lastName;
	private Integer credits;
	private String photoUrl;
	private Instant createdAt;
	
	public ProfileDTO(String id, String clerkId, String email, String firstName, String lastName, Integer credits,
			String photoUrl, Instant createdAt) {
		super();
		this.id = id;
		this.clerkId = clerkId;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.credits = credits;
		this.photoUrl = photoUrl;
		this.createdAt = createdAt;
	}
	
	
	
	
	
}
