package com.onlinecampusinfo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CourseRequest {

    @NotBlank(message = "Course name is required")
    private String name;

    private String department;
    private String duration;
    private String degreeType;
    private String eligibilityCriteria;
    private Integer totalSeats;
    private BigDecimal fee;
    private String description;
}