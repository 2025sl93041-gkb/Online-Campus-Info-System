package com.onlinecampusinfo.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 100)
    private String department;

    @Column(length = 50)
    private String duration;

    @Column(name = "degree_type", length = 50)
    private String degreeType;

    @Column(name = "eligibility_criteria", columnDefinition = "TEXT")
    private String eligibilityCriteria;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @Column(precision = 10, scale = 2)
    private BigDecimal fee;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}