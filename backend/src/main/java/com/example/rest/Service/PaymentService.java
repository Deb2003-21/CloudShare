package com.example.rest.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.rest.dto.Document;
import com.example.rest.dto.PayementDTO;
import com.example.rest.dto.PaymentVerificationDTO;
import com.example.rest.repo.PaymentTransRepo;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@Service
public class PaymentService {

	private final ProfileService profileService;
	private final UserCreditService usc;
	private String razorpayKeyId;
	private String razorpayKeySecret;
	private final PaymentTransRepo paymentTransRepo;

	public PaymentService(ProfileService profileService, UserCreditService usc,
			@Value("${razorpay.key.id}") String razorpayKeyId,
			@Value("${razorpay.key.secret}") String razorpayKeySecret, PaymentTransRepo paymentTransRepo) {
		this.profileService = profileService;
		this.usc = usc;
		this.razorpayKeyId = razorpayKeyId;
		this.razorpayKeySecret = razorpayKeySecret;
		this.paymentTransRepo = paymentTransRepo;
	}
	
	// generate matching signature
	 public static String generateHmacSha256(String data, String secret) {
	        try {
	            Mac mac = Mac.getInstance("HmacSHA256");

	            SecretKeySpec secretKey =
	                    new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
	                                      "HmacSHA256");

	            mac.init(secretKey);

	            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

	            // Convert to Hex
	            StringBuilder hex = new StringBuilder();
	            for (byte b : rawHmac) {
	                hex.append(String.format("%02x", b));
	            }

	            return hex.toString();

	        } catch (Exception e) {
	            throw new RuntimeException("Error generating HMAC", e);
	        }
	    }

	public PayementDTO createOrder(PayementDTO paymentDTO) { // no usages
		try {
			Document currentProfile = profileService.getCurrentProfile();
			String clerkId = currentProfile.getClerkId();

			RazorpayClient razorpaycli = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
			JSONObject orderReq = new JSONObject();
			orderReq.put("amount", paymentDTO.getAmount());
			orderReq.put("currency", paymentDTO.getCurrency());
			

			Order order = razorpaycli.Orders.create(orderReq);
			String orderid = order.get("id");
			paymentDTO.setClerkId(clerkId);
			paymentDTO.setOrderId(orderid);
			paymentDTO.setStatus("pending");
			paymentDTO.setTransactionDate(LocalDateTime.now());
			paymentDTO.setEmail(currentProfile.getEmail());
			;
			paymentDTO.setUsername(currentProfile.getFirstName() + " " + currentProfile.getLastName());
			;

		} catch (Exception e) {
			paymentDTO.setStatus("failed");
			paymentDTO.setTransactionDate(LocalDateTime.now());
			System.out.print(e.getMessage());

		}
		paymentTransRepo.save(paymentDTO);
		return paymentDTO;
	}

	public String  verifyPayment(PaymentVerificationDTO request)
	{
		try {
		    Document currentProfile = profileService.getCurrentProfile();
		    String clerkId = currentProfile.getClerkId();
		    

		    String data=request.getRazorpay_order_id() + "|" + request.getRazorpay_payment_id();
		    String generatedSignature= generateHmacSha256(data,razorpayKeySecret);
		    if (!generatedSignature.equals(request.getRazorpay_signature())) {
		    	updateTransactionStatus(request.getRazorpay_order_id(),"FAILED",request.getRazorpay_payment_id(),null);
		    	return "failed";
		    }
		    
		 // Add credits based on plan
		    int creditsToAdd = 0;
		    String plan = "BASIC";

		    switch (request.getPlanId()) {
		        case "premium":
		            creditsToAdd = 500;
		            plan="PREMIUM";
		            break;
		        case "ultimate":
		        	creditsToAdd = 5000;
		            plan="ULTIMATE";
		        	break;
		    }
		    
		    if(creditsToAdd>0) {
		    	usc.addCredits(clerkId, creditsToAdd ,plan);
		    	updateTransactionStatus(request.getRazorpay_order_id(),"SUCCESS",request.getRazorpay_payment_id(),creditsToAdd);
		    	return "success";
		    	
		    }
		    
		} catch (Exception e) {
			updateTransactionStatus(request.getRazorpay_order_id(),"FAILED",request.getRazorpay_payment_id(),null);
			throw new RuntimeException(e);
		}
		
		return "failed";
	}

	private void updateTransactionStatus(String razorpay_order_id, String status, String razorpay_payment_id,
		Integer creditsToAdd) {
		paymentTransRepo.findAll()
	    .stream()
	    .filter(t -> t.getOrderId() != null && t.getOrderId().equals(razorpay_order_id))
	    .findFirst()
	    .map(transaction -> {
	        transaction.setStatus(status);
	        transaction.setPaymentId(razorpay_payment_id);
	        if (creditsToAdd != null) {
	           transaction.setCreditsAdded(creditsToAdd); 
	        }
	        return paymentTransRepo.save(transaction);
	    })
	    .orElse(null);
		
	}

}
