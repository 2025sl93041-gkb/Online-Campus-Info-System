package com.onlinecampusinfo.model;

import com.onlinecampusinfo.model.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;

    @Column(name = "student_email", nullable = false, length = 150)
    private String studentEmail;

    @Column(name = "student_phone", length = 15)
    private String studentPhone;

    @Column(length = 100)
    private String qualification;

    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "statement_of_purpose", columnDefinition = "TEXT")
    private String statementOfPurpose;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @CreationTimestamp
    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}