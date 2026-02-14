package com.example.rest.Controller;

import java.io.IOException;
import java.net.MalformedURLException;

import org.springframework.http.HttpHeaders;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.rest.Service.FileService;
import com.example.rest.Service.UserCreditService;
import com.example.rest.dto.FileDataDoC;
import com.example.rest.dto.userCredits;
import com.example.rest.repo.FileDataRepo;

@RestController
@RequestMapping("/files")
public class FileController {

	private FileService fileService;
	private UserCreditService userCreditService;
	
	
	private String dir;

	public FileController(FileService fileService, UserCreditService userCreditService,@Value("${file.upload-dir}")String  dir) {
		this.fileService = fileService;
		this.userCreditService = userCreditService;
		this.dir=dir;

	}

	@PostMapping("/upload")
	public ResponseEntity<?> upload(@RequestPart("files") MultipartFile files[]) throws IOException {

		Map<String, Object> response = new HashMap<>();
		List<FileDataDoC> list = fileService.uploadFiles(files);

		userCredits finalCredits = userCreditService.getUserCredits();

		// updated credits
		response.put("files", list);
		response.put("remainingCredits", finalCredits);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/all")
	public ResponseEntity<?> getFilesForCurrentuser() {
		List<FileDataDoC> files = fileService.getFiles();
		return ResponseEntity.ok(files);
	}

	@GetMapping("/public/{id}")
	public ResponseEntity<Resource> getPublicFile(@PathVariable String id)
	        throws Exception {

	    FileDataDoC file = fileService.getPublicFile(id);

	    if (file == null) {
	        return ResponseEntity.notFound().build();
	    }

	    Path path = Paths.get(dir)
	                     .resolve(file.getFileLoc())
	                     .normalize();

	    Resource resource = new UrlResource(path.toUri());
	    
	    if (!resource.exists()) {
	        return ResponseEntity.notFound().build();
	    }

	    String contentType = Files.probeContentType(path);

	    if (contentType == null) {
	        contentType = "application/octet-stream";
	    }

	    return ResponseEntity.ok()
	            .contentType(MediaType.parseMediaType(contentType))
	            .header(HttpHeaders.CONTENT_DISPOSITION,
	                    "inline; filename=\"" + file.getName() + "\"")
	            .body(resource);
	}

	@CrossOrigin(origins = "*")
	@GetMapping("/download/{id}")
	public ResponseEntity<Resource> download(@PathVariable String id) throws IOException {
		FileDataDoC downloadableFile = fileService.getDownloadableFile(id);

		Path path = Paths.get(downloadableFile.getFileLoc());
		Resource resource = new UrlResource(path.toUri());

		return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM)
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadableFile.getName() + "")
				.body(resource);
	}

	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deletefile(@PathVariable String id) {
		fileService.deleteFile(id);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{id}/toggle-public")
	public ResponseEntity<?> togglePublic(@PathVariable String id) {
		FileDataDoC file = fileService.togglePublic(id);
		return ResponseEntity.ok(file);
	}

}
