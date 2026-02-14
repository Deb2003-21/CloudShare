package com.example.rest.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.rest.dto.userCredits;
import com.example.rest.repo.UserCreditRepo;

@Service
public class UserCreditService {
	@Autowired
	private  UserCreditRepo ucr;
	@Autowired
	private ProfileService psr;

	public userCredits creditInit(String clerkId)
	{
		userCredits usc=new userCredits();
		usc.setClerkId(clerkId);
		usc.setCredits(5);
		usc.setPlan("BASIC");
		
		return ucr.save(usc);
	}
	
	// initializing credits
	public userCredits getuserCredits(String clerkId)
	{
		return ucr.findByClerkId(clerkId)
				  .orElseGet(()->creditInit(clerkId));
	}
	
	// getting current user clerkid  
	public userCredits getUserCredits() { 
	    String clerkId = psr.getCurrentProfile().getClerkId();
	    return getuserCredits(clerkId);
	}
	
	// checking required credits
	public Boolean hasEnoughCredits(int requiredCredits) {
		userCredits userCredits = getUserCredits();
	    return userCredits.getCredits() >= requiredCredits;
	}
	
	// managing credits consumptions
	public userCredits consume() {
		userCredits userCredits=getUserCredits();
		if (userCredits.getCredits()<=0) {
			return null;
		}
		userCredits.setCredits(userCredits.getCredits()-1);
		return ucr.save(userCredits);
	}
	
	//adding credits
	public userCredits addCredits(String clerkId,Integer creditsToAdd,String plan) {
		userCredits uc= ucr.findByClerkId(clerkId)
			.orElseGet(()->creditInit(clerkId));
		Integer currcredit=uc.getCredits();
		if (currcredit==null) {
			currcredit=0;
		}
		uc.setCredits(currcredit+creditsToAdd);
		uc.setPlan(plan);
		return ucr.save(uc);
	}
}
