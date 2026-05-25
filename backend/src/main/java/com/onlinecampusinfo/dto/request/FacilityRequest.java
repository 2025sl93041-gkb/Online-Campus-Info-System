package com.onlinecampusinfo.dto.request;

import com.onlinecampusinfo.model.enums.FacilityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FacilityRequest {

    @NotNull(message = "Facility type is required")
    private FacilityType type;

    @NotBlank(message = "Facility name is required")
    private String name;

    private String description;
    private Integer capacity;
    private String details;
}