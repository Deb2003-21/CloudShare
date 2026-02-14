package com.example.rest.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rest.Service.ProfileService;
import com.example.rest.dto.Document;
import com.example.rest.dto.PayementDTO;
import com.example.rest.repo.PaymentTransRepo;

@RestController
public class TransactionController {

	private final PaymentTransRepo paymentTransRepo;
	private final ProfileService profileService;
	
	public TransactionController(PaymentTransRepo paymentTransRepo, ProfileService profileService) {
		this.paymentTransRepo = paymentTransRepo;
		this.profileService = profileService;
	}
	
	// get list of commited transactions
	@GetMapping("/transactions")
	public ResponseEntity<?> getUserTransactions() {

	    Document currentProfile = profileService.getCurrentProfile();
	    String clerkId = currentProfile.getClerkId();
	    List<PayementDTO> transactions =paymentTransRepo.findByClerkIdAndStatusOrderByTransactionDateDesc(clerkId,"SUCCESS");
	    return ResponseEntity.ok(transactions);
	}
	
}
