package com.enterprisesystemengineering.dto;

import com.enterprisesystemengineering.entity.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
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

    public LoginResponseDto(User user, String token) {
        this.token = token;
        this.email = user.getEmail();
        this.role = user.getRole().toString();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
    }
}
