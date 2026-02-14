package com.example.rest.config;

import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer{

	@Override
	// allowing files to upload in uploads dir 
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	
		String  uploadDir =Paths.get("uploads").toAbsolutePath().toString();
		registry.addResourceHandler("/uploads/**")
				.addResourceLocations("file:"+uploadDir+"/");
	}
	
	
}
