package com.example.rest.Service;

import java.time.Instant;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.rest.Exceptions.EmailAlreadyExistsException;
import com.example.rest.dto.Document;
import com.example.rest.repo.Repo;
import com.mongodb.DuplicateKeyException;

@Service
public class ProfileService {

	private final Repo profileRepo;
	
	public ProfileService(Repo profileRepo) {
        this.profileRepo = profileRepo;
    }
	
	public Document createProfile(Document profileDTO) throws EmailAlreadyExistsException {

		Document profile = new Document();
        profile.setClerkId(profileDTO.getClerkId());
        profile.setEmail(profileDTO.getEmail());
        profile.setFirstName(profileDTO.getFirstName());
        profile.setLastName(profileDTO.getLastName());
        profile.setPhotoUrl(profileDTO.getPhotoUrl());
        profile.setCredits(5);
        profile.setCreatedAt(Instant.now());
        
        
        if (profileRepo.findByEmail(profile.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        try {
            profileRepo.save(profile);
        } catch (DuplicateKeyException e) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

       
        return profile;
	}
	
	public Document update(Document profile) {
		Document existingProfile=profileRepo.findByClerkId(profile.getClerkId());
		if (existingProfile!=null) {
			if (profile.getEmail()!=null && !profile.getEmail().isEmpty())
			{
				existingProfile.setEmail(profile.getEmail());
			}
			if (profile.getFirstName() != null && !profile.getFirstName().isEmpty()) {
			    existingProfile.setFirstName(profile.getFirstName());
			}

			if (profile.getLastName() != null && !profile.getLastName().isEmpty()) {
			    existingProfile.setLastName(profile.getLastName());
			}

			if (profile.getPhotoUrl() != null && !profile.getPhotoUrl().isEmpty()) {
			    existingProfile.setFirstName(profile.getFirstName());
			}
		}
		return profileRepo.save(existingProfile);
	}
	
	public void  deleteprofile(String clerkId)
	{
		Document existingProfile=profileRepo.findByClerkId(clerkId);
		if (existingProfile!=null)
		{
			profileRepo.delete(existingProfile);
		}
	}

	public Document getCurrentProfile(){
		if (SecurityContextHolder.getContext().getAuthentication()==null)
		{
			throw new UsernameNotFoundException("user not authenticated");
			
		}
		// Extract the current user's clerkId from the security context
		String clerkId = SecurityContextHolder.getContext()
		                                      .getAuthentication()
		                                      .getName();

		return profileRepo.findByClerkId(clerkId);
		
	}
	  
	  
	
	
}
