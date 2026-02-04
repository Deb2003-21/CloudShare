/*package com.example.rest.Security;

import java.io.IOException;
import java.security.PublicKey;
import java.util.Base64;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;*/
package com.example.rest.Security;

import java.io.IOException;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

@Component
public class ClerkjwtFilter extends OncePerRequestFilter {

    private final ClerkjwksProvider jwksProvider;
    private final String issuer;

    public ClerkjwtFilter(
            @Value("${clerk.issuer}") String issuer,
            ClerkjwksProvider jwksProvider
    ) {
        this.issuer = issuer;
        this.jwksProvider = jwksProvider;
    }

    /**
     * Skip security for public routes
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/webhooks")
                || path.startsWith("/error")
                || path.equals("/files/download/**") ||path.equals("/public");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");

            // ⛔ No token → continue (NOT an error)
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(7);

            // Decode token (no verification yet)
            DecodedJWT jwt = JWT.decode(token);

            // Issuer validation
            if (!issuer.equals(jwt.getIssuer())) {
                filterChain.doFilter(request, response);
                return;
            }

            // Get public key from JWKS
            String kid = jwt.getKeyId();
            PublicKey publicKey = jwksProvider.getPublicKey(kid);

            Algorithm algorithm =
                    Algorithm.RSA256((RSAPublicKey) publicKey, null);

            // Verify signature
            algorithm.verify(jwt);

            // ✅ CREATE AUTHENTICATION (THIS IS CRITICAL)
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            jwt.getSubject(),   // principal (NEVER null)
                            null,
                            List.of()           // authorities (empty OK)
                    );

            // ✅ SET SECURITY CONTEXT
            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

        } catch (Exception ex) {
            // ❌ NEVER sendError() here
            SecurityContextHolder.clearContext();
        }

        // 🔥 MUST ALWAYS CONTINUE FILTER CHAIN
        filterChain.doFilter(request, response);
    }
}



/*
public class ClerkjwtFilter extends OncePerRequestFilter{

	
	private String clerkIssuer;
	private final ClerkjwksProvider jwskprovider;
	
	
	public ClerkjwtFilter(@Value("${clerk.issuer}") String clerkIssuer,ClerkjwksProvider jwskprovider) {
		this.clerkIssuer=clerkIssuer;
		this.jwskprovider = jwskprovider;
	}


	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		if (request.getRequestURI().contains("/webhooks"))
		{
			filterChain.doFilter(request, response);
			return;
		}
		String authHeader = request.getHeader( "Authorization");

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
		    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Authorization failed");
		}
		try {
			String token=authHeader.substring(7);
			String[] chunks=token.split("\\.*");
			if (chunks.length<3)
			{
				response.sendError(HttpServletResponse.SC_FORBIDDEN,"invalid jwt token");
				return;
			}
			String headerJson = new String(Base64.getUrlDecoder().decode(chunks[0]));
			ObjectMapper mapper = new ObjectMapper();
			JsonNode headerNode = mapper.readTree(headerJson);

			if (!headerNode.has("kid")) {
				response.sendError(HttpServletResponse.SC_FORBIDDEN,"token header is missing");
			}
			String kid = headerNode.get("kid").asText();

			PublicKey publicKey = jwskprovider.getPublicKey(kid);

			// verify the token
			Claims claims = Jwts.parserBuilder()
			    .setSigningKey(publicKey)
			    .requireIssuer(clerkIssuer)       // adjust issuer as needed
			    .setAllowedClockSkewSeconds(60)
			    .build()
			    .parseClaimsJws(token)
			    .getBody();
		    String clerkId= claims.getSubject();
		    UsernamePasswordAuthenticationToken authtoken=new UsernamePasswordAuthenticationToken(clerkId,null,Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
		    SecurityContextHolder.getContext().setAuthentication(authtoken);
		}
		catch(Exception e)
		{
			response.sendError(HttpServletResponse.SC_FORBIDDEN,e.getMessage());
		}
		filterChain.doFilter(request, response);
		
		
	}
	
	
	
}*/
