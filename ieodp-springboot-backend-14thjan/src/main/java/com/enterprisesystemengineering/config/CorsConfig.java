package com.enterprisesystemengineering.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS Configuration for Kubernetes-friendly React Frontend Integration
 * Enables direct communication between React frontend and Spring Boot backend
 * without going through Nginx proxy.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Allow all origins - configure more restrictively in production
                .allowedOriginPatterns(
                    "http://localhost:*",           // Local development
                    "http://localhost:3000",         // React dev server
                    "http://localhost:5173",         // Vite dev server
                    "http://localhost:8000",         // Docker frontend
                    "http://127.0.0.1:*",            // Loopback
                    "http://*.local:*",              // Local network
                    "http://frontend-service:*",     // Kubernetes service name
                    "http://frontend:*",             // Kubernetes service
                    "https://*"                      // HTTPS production domains
                )
                // Allow all HTTP methods needed by React frontend
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD")
                // Allow Authorization header and other custom headers
                .allowedHeaders("*")
                // Allow credentials (cookies, authorization headers)
                .allowCredentials(true)
                // Cache preflight requests for 1 hour
                .maxAge(3600);
    }
}
