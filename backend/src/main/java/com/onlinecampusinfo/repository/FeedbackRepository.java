package com.onlinecampusinfo.repository;

import com.onlinecampusinfo.model.Feedback;
import com.onlinecampusinfo.model.enums.FeedbackType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByCollegeId(Long collegeId);

    List<Feedback> findByCounsellorId(Long counsellorId);

    List<Feedback> findByStudentId(Long studentId);

    List<Feedback> findByType(FeedbackType type);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.college.id = :collegeId")
    Double getAverageRatingByCollegeId(@Param("collegeId") Long collegeId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.counsellor.id = :counsellorId")
    Double getAverageRatingByCounsellorId(@Param("counsellorId") Long counsellorId);

    long countByCollegeId(Long collegeId);

    long countByCounsellorId(Long counsellorId);
}