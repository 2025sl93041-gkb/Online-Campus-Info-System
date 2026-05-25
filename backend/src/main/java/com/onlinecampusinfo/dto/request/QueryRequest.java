package com.onlinecampusinfo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QueryRequest {

    private Long collegeId;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Message is required")
    private String message;
}