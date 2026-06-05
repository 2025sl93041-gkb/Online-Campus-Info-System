package com.onlinecampusinfo.repository;

import com.onlinecampusinfo.model.CounsellorAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CounsellorAssignmentRepository extends JpaRepository<CounsellorAssignment, Long> {

    List<CounsellorAssignment> findByCounsellorId(Long counsellorId);

    List<CounsellorAssignment> findByCollegeId(Long collegeId);

    long countByCounsellorId(Long counsellorId);

    Optional<CounsellorAssignment> findByCounsellorIdAndCollegeId(Long counsellorId, Long collegeId);

    boolean existsByCounsellorIdAndCollegeId(Long counsellorId, Long collegeId);

    void deleteByCounsellorIdAndCollegeId(Long counsellorId, Long collegeId);
}