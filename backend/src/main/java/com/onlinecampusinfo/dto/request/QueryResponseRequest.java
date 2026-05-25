package com.onlinecampusinfo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QueryResponseRequest {

    @NotBlank(message = "Response is required")
    private String response;
}