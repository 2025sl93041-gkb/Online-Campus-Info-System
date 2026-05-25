package com.onlinecampusinfo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ApplicationRequest {

    @NotNull(message = "College ID is required")
    private Long collegeId;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotBlank(message = "Student name is required")
    private String studentName;

    @NotBlank(message = "Student email is required")
    private String studentEmail;

    private String studentPhone;
    private String qualification;
    private BigDecimal percentage;
    private String address;
    private String statementOfPurpose;
}