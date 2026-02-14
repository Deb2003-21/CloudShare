
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


