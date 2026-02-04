package com.example.rest.Controller;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.rest.Service.ProfileService;
import com.example.rest.Service.UserCreditService;
import com.example.rest.dto.Document;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@RequestMapping("/webhooks")
@RestController
public class ClerkWebhookController {

	@Value("${clerk.webhook.secret}")
    private String webhookSecret;
	private ProfileService prs;
	private UserCreditService ucs;
	
    public ClerkWebhookController(@Value("${clerk.webhook.secret}") String webhookSecret, ProfileService prs,UserCreditService ucs) {
		this.prs = prs;
		this.ucs=ucs;
	}

	@PostMapping("/clerk")
    public ResponseEntity<?> handleClerkWebhook(
            @RequestHeader("svix-id") String svixId,
            @RequestHeader("svix-timestamp") String svixTimestamp,
            @RequestHeader("svix-signature") String svixSignature,
            @RequestBody String payload) {
    	
    	try {
    	    boolean isValid = verifyWebhookSignature(svixId, svixTimestamp, svixSignature, payload);
    	    if (!isValid) {
    	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid webhook signature");
    	    }
    	    ObjectMapper mapper= new ObjectMapper();
    	    JsonNode rootNode =mapper.readTree(payload);
    	    String eventType=rootNode.path("type").asText();
    	    switch(eventType) {
    	    	case "user.created":
    	    		handleUserCreated(rootNode.path("data"));
    	    		break;
    	    	case "user.updated":
    	    		handleUserUpdated(rootNode.path("data"));
    	    		break;
    	    	case "user.deleted":
    	    		handleUserDeleted(rootNode.path("data"));
    	    		break;
    	    	}
    	     return ResponseEntity.ok().build();
    	} catch (Exception e) {
    		throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,e.getMessage());
    	}
    
    }

	private void handleUserDeleted(JsonNode data) {
		// TODO Auto-generated method stub
		String clerkId = data.path("id").asText();
		prs.deleteprofile(clerkId);
	}

	private void handleUserUpdated(JsonNode data) {
		// TODO Auto-generated method stub
		String clerkId = data.path("id").asText();
		String email = "";
		JsonNode emailAddresses = data.path("email_addresses");
		if (emailAddresses.isArray() && emailAddresses.size() > 0) {
		    email = emailAddresses.get(0).path("email_address").asText();
		}

		String firstName = data.path("first_name").asText( "");
		String lastName = data.path("last_name").asText( "");
		String photoUrl = data.path("image_url").asText( "");
		
		Document profile = new Document();
        profile.setClerkId(clerkId);
        profile.setEmail(email);
        profile.setFirstName(firstName);
        profile.setLastName(lastName);
        profile.setPhotoUrl(photoUrl);
        profile.setCreatedAt(Instant.now());

        profile=prs.update(profile);
		if (profile!=null) {
			handleUserCreated(data);
		}
		
	}

	private void handleUserCreated(JsonNode data) {
		String clerkId = data.path("id").asText();

		String email = "";
		JsonNode emailAddresses = data.path("email_addresses");
		if (emailAddresses.isArray() && emailAddresses.size() > 0) {
		    email = emailAddresses.get(0).path("email_address").asText();
		}

		String firstName = data.path("first_name").asText( "");
		String lastName  = data.path("last_name").asText( "");
		String photoUrl  = data.path("image_url").asText( "");
		
		Document profile = new Document();
        profile.setClerkId(clerkId);
        profile.setEmail(email);
        profile.setFirstName(firstName);
        profile.setLastName(lastName);
        profile.setPhotoUrl(photoUrl);
        profile.setCreatedAt(Instant.now());

		prs.createProfile(profile);
		ucs.creditInit(clerkId);

	}

	private boolean verifyWebhookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {
		// TODO Auto-generated method stub
		return true;
	}
}
