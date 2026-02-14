package com.example.rest.Exceptions;

public class EmailAlreadyExistsException extends RuntimeException {

	public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
