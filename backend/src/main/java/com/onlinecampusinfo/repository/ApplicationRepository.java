package com.onlinecampusinfo.repository;

import com.onlinecampusinfo.model.Application;
import com.onlinecampusinfo.model.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStudentId(Long studentId);

    List<Application> findByCollegeId(Long collegeId);

    List<Application> findByCollegeIdAndStatus(Long collegeId, ApplicationStatus status);

    long countByCollegeId(Long collegeId);

    long countByStatus(ApplicationStatus status);
}