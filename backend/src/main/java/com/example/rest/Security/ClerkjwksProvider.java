package com.example.rest.Security;

import java.math.BigInteger;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ClerkjwksProvider {

    private final String jwksurl;

    public ClerkjwksProvider(@Value("${clerk.jwks-url}") String jwksurl) {
        this.jwksurl = jwksurl;
    }

    private final Map<String, PublicKey> keyCache = new HashMap<>();
    private long lastFetchTime = 0;

    private static final long CACHE_TTL = 60 * 60 * 1000; // 1 hour

    public PublicKey getPublicKey(String kid) throws Exception {

        if (keyCache.containsKey(kid)
                && System.currentTimeMillis() - lastFetchTime < CACHE_TTL) {
            return keyCache.get(kid);
        }

        refreshKeys();

        PublicKey key = keyCache.get(kid);
        if (key == null) {
            throw new IllegalStateException("No public key found for kid: " + kid);
        }

        return key;
    }

    private void refreshKeys() throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        JsonNode jwks = mapper.readTree(new URL(jwksurl).openStream());

        JsonNode keys = jwks.get("keys");

        for (JsonNode keyNode : keys) {

            if (!"RSA".equals(keyNode.get("kty").asText())) continue;
            if (!"RS256".equals(keyNode.get("alg").asText())) continue;

            String kid = keyNode.get("kid").asText();
            String n = keyNode.get("n").asText();
            String e = keyNode.get("e").asText();

            PublicKey publicKey = createPublicKey(n, e);
            keyCache.put(kid, publicKey);
        }

        lastFetchTime = System.currentTimeMillis();
    }

    private PublicKey createPublicKey(String n, String e) throws Exception {

        byte[] modbyte = Base64.getUrlDecoder().decode(n);
        byte[] expbyte = Base64.getUrlDecoder().decode(e);

        BigInteger modulus = new BigInteger(1, modbyte);
        BigInteger exponent = new BigInteger(1, expbyte);

        RSAPublicKeySpec spec = new RSAPublicKeySpec(modulus, exponent);
        return KeyFactory.getInstance("RSA").generatePublic(spec);
    }
}
