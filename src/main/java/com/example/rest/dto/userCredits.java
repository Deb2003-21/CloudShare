package com.example.rest.dto;

import org.springframework.data.annotation.Id;

@org.springframework.data.mongodb.core.mapping.Document(collection="user_credits")
public class userCredits {

	@Id
	private String id;
	private String clerkId;
	private Integer credits;
	private String plan;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getClerkId() {
		return clerkId;
	}
	public void setClerkId(String clerkId) {
		this.clerkId = clerkId;
	}
	public Integer getCredits() {
		return credits;
	}
	public void setCredits(Integer credits) {
		this.credits = credits;
	}
	public String getPlan() {
		return plan;
	}
	public void setPlan(String plan) {
		this.plan = plan;
	}
	
}
