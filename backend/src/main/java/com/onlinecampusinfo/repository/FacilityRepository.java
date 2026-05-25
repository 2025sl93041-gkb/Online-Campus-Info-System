package com.onlinecampusinfo.repository;

import com.onlinecampusinfo.model.Facility;
import com.onlinecampusinfo.model.enums.FacilityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {

    List<Facility> findByCollegeId(Long collegeId);

    List<Facility> findByCollegeIdAndType(Long collegeId, FacilityType type);
}