package com.onlinecampusinfo.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "college_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollegeImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(length = 200)
    private String caption;

    @Column(name = "facility_type", length = 50)
    private String facilityType;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}