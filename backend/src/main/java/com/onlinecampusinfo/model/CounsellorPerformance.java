package com.onlinecampusinfo.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Historical record of counsellor activity. 
 * This is immutable - records are never deleted even if original query is removed.
 * Used for accurate counsellor performance reporting.
 */
@Entity
@Table(name = "counsellor_performance_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounsellorPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counsellor_id", nullable = false)
    private User counsellor;

    @Column(name = "query_id")
    private Long queryId; // Reference to original query (may be null if deleted)

    @Column(name = "student_id")
    private Long studentId; // Reference to student

    @Column(name = "college_id")
    private Long collegeId;

    @Column(length = 200)
    private String querySubject;

    @Column(name = "action_type", length = 50, nullable = false)
    private String actionType; // RESOLVED, RESPONDED

    @CreationTimestamp
    @Column(name = "logged_at", updatable = false)
    private LocalDateTime loggedAt;
}