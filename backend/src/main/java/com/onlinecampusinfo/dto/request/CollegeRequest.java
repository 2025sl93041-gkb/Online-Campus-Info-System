package com.onlinecampusinfo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CollegeRequest {

    @NotBlank(message = "College name is required")
    private String name;

    private String description;
    private String location;
    private String city;
    private String state;
    private Integer establishedYear;
    private Integer strength;
    private String website;
    private String contactEmail;
    private String contactPhone;
}