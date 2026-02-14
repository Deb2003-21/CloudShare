package com.example.rest.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.rest.Service.ProfileService;
import com.example.rest.dto.Document;

@org.springframework.web.bind.annotation.RestController
public class RestController {
	
	private final ProfileService prs;
	
	
	public RestController(ProfileService prs) {
		this.prs = prs;
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody Document profile)
	{
		Document saved_profile=prs.createProfile(profile);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved_profile);
	}
	
	@PostMapping("/update")
	public ResponseEntity<?> update(@RequestBody Document profile)
	{
		Document saved_profile=prs.update(profile);
		return ResponseEntity.status(HttpStatus.OK).body(saved_profile);
	}
	
	
	
}
