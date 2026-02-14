package com.example.rest.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rest.Service.PaymentService;
import com.example.rest.dto.PayementDTO;
import com.example.rest.dto.PaymentVerificationDTO;

@RestController
@RequestMapping("/payments")
public class PaymentController {

	private final PaymentService paymentService;

	public PaymentController(PaymentService paymentService) {
		this.paymentService = paymentService;
	}

	@PostMapping("/create-order")
	public ResponseEntity<?> createOrder(@RequestBody PayementDTO paymentdto) {
		PayementDTO response = paymentService.createOrder(paymentdto);

		if (response.getStatus().equals("pending")) {
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.badRequest().body(response);
		}

		
	}

	@PostMapping("/verify-payment")
	public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationDTO request) {
		String response = paymentService.verifyPayment(request);

		if (response.equals("success")) {
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.badRequest().body(response);
		}

	}
}
