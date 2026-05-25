package com.onlinecampusinfo.model;

import com.onlinecampusinfo.model.enums.FacilityType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "facilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacilityType type;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer capacity;

    @Column(columnDefinition = "TEXT")
    private String details;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}