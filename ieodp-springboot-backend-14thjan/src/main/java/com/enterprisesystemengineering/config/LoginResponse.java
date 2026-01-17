package com.enterprisesystemengineering.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    @JsonProperty("token")
    private String token;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("role")
    private String role;
    
    @JsonProperty("firstName")
    private String firstName;
    
    @JsonProperty("lastName")
    private String lastName;
    
    public LoginResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }
}
