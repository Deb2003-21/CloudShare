package com.example.rest.dto;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection =  "files")
public class FileDataDoC {

	@Id
	private String id;
	private String name;
	private String type;
	private Long size;
	private String clerkId;
	private Boolean isPublic;
	private String fileLoc;
	private LocalDateTime uploadAt;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Long getSize() {
		return size;
	}
	public void setSize(Long size) {
		this.size = size;
	}
	public String getClerkId() {
		return clerkId;
	}
	public void setClerkId(String clerkId) {
		this.clerkId = clerkId;
	}
	public Boolean getIsPublic() {
		return isPublic;
	}
	public void setIsPublic(Boolean isPublic) {
		this.isPublic = isPublic;
	}
	public String getFileLoc() {
		return fileLoc;
	}
	public void setFileLoc(String fileLoc) {
		this.fileLoc = fileLoc;
	}
	public LocalDateTime getUploadAt() {
		return uploadAt;
	}
	public void setUploadAt(LocalDateTime uploadAt) {
		this.uploadAt = uploadAt;
	}
	
	
}
