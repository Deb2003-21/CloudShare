package com.example.rest.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.rest.dto.Document;
import com.example.rest.dto.FileDataDoC;
import com.example.rest.repo.FileDataRepo;


@Service
public class FileService {

	private ProfileService profileService;
	private UserCreditService userCreditService;
	private FileDataRepo fileRepo;
	
	public FileService(ProfileService profileService, UserCreditService userCreditService, FileDataRepo fileRepo) {
		this.profileService = profileService;
		this.userCreditService = userCreditService;
		this.fileRepo = fileRepo;
	}

	// upload files
	public List<FileDataDoC> uploadFiles(MultipartFile files[]) throws IOException
	{
		// get current user profile
		Document curProfile= profileService.getCurrentProfile();
		if (!userCreditService.hasEnoughCredits(files.length))
		{
			throw new RuntimeException("Not enough credits");
		}
		//storing list of files
		List<FileDataDoC> savedFiles=new ArrayList<>();
		
		//getting the upload path
		Path uploadPath=Paths.get("upload").toAbsolutePath().normalize();
		Files.createDirectories(uploadPath);
		
		for (MultipartFile file : files)
		{
			// new file extention for resolving name conventions
			String filename=UUID.randomUUID()+"."+StringUtils.getFilenameExtension(file.getOriginalFilename());
			Path targetLoc=uploadPath.resolve(filename);
			Files.copy(file.getInputStream(), targetLoc,StandardCopyOption.REPLACE_EXISTING);
			
			// saving on DB
			FileDataDoC file_data= new FileDataDoC();
			file_data.setFileLoc(targetLoc.toString());
			file_data.setName(file.getOriginalFilename());
			file_data.setSize(file.getSize());
			file_data.setType(file.getContentType());
			file_data.setClerkId(curProfile.getClerkId());
			file_data.setIsPublic(false);
			file_data.setUploadAt(LocalDateTime.now());
			
			// managing credits
			userCreditService.consume();
			
			savedFiles.add(fileRepo.save(file_data));
			
		}
		return savedFiles;
	}
	
	// get all files
	public List<FileDataDoC> getFiles() {
	    Document currentProfile = profileService.getCurrentProfile();
	    List<FileDataDoC> files = fileRepo.findByClerkId(currentProfile.getClerkId());
	    return files;
	}
	
	//shpwing public files
	public FileDataDoC getPublicFile(String id) {
	    Optional<FileDataDoC> fileOptional = fileRepo.findById(id);
	    if (fileOptional.isEmpty() || !fileOptional.get().getIsPublic()) {
	        throw new RuntimeException("Unable to get the file");
	    }

	    return fileOptional.get();
	}

	public FileDataDoC getDownloadableFile(String id) /* possible modifiers? */ {
	    FileDataDoC file = fileRepo.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
	    return file;
	}

	public void deleteFile(String id) {
	    try {
	        Document currentProfile = profileService.getCurrentProfile();
	        FileDataDoC file = fileRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("File not found"));

	        if (!file.getClerkId().equals(currentProfile.getClerkId())) {
	            throw new RuntimeException("File is not belong to current user");
	        }
	        Path filePath=Paths.get(file.getFileLoc());
	        Files.deleteIfExists(filePath);
	        
	        fileRepo.deleteById(id);
	    } catch (Exception e) {
	        throw new RuntimeException("something went wrong");
	    }
	}
	
	// change the file visibility 
	public FileDataDoC togglePublic(String id) {
	    FileDataDoC file = fileRepo.findById(id)
	        .orElseThrow(() -> new RuntimeException("File not found"));

	    file.setIsPublic(!file.getIsPublic());
	    fileRepo.save(file);
	    return file;
	}
}
