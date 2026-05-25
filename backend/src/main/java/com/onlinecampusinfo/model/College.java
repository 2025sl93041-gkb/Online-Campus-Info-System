package com.onlinecampusinfo.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "colleges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class College {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 200)
    private String location;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(name = "established_year")
    private Integer establishedYear;

    private Integer strength;

    @Column(length = 255)
    private String website;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 15)
    private String contactPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private User admin;

    @OneToMany(mappedBy = "college", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Course> courses = new ArrayList<>();

    @OneToMany(mappedBy = "college", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Facility> facilities = new ArrayList<>();

    @OneToMany(mappedBy = "college", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CollegeImage> images = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}