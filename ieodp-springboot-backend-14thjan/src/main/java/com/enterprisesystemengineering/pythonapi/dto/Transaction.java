package com.enterprisesystemengineering.pythonapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {
    @JsonProperty("value")
    private Double value;

    @JsonProperty("currency")
    private String currency;
}
