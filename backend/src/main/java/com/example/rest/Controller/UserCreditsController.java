package com.example.rest.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rest.Service.UserCreditService;
import com.example.rest.dto.userCredits;

@RestController
@RequestMapping("/users")
public class UserCreditsController {
	
	private final UserCreditService usr;
	
	
	public UserCreditsController(UserCreditService usr) {
		this.usr = usr;
	}
	@GetMapping("/credits")
	public ResponseEntity<?> getuserCredits()
	{
		userCredits uc=usr.getUserCredits();
		
		return ResponseEntity.ok(uc);
		
	}

}
