package com.onlinecampusinfo.dto.request;

import com.onlinecampusinfo.model.enums.FeedbackType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FeedbackRequest {

    private Long collegeId;
    private Long counsellorId;

    @NotNull(message = "Feedback type is required")
    private FeedbackType type;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    private String comment;
}