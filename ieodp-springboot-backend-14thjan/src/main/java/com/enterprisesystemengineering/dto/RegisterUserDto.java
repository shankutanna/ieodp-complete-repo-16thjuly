package com.enterprisesystemengineering.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserDto {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private String mobileNumber;
    private String gender;
    private String department;
}