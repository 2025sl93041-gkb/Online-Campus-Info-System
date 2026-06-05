package com.onlinecampusinfo.repository;

import com.onlinecampusinfo.model.CounsellorPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CounsellorPerformanceRepository extends JpaRepository<CounsellorPerformance, Long> {

    List<CounsellorPerformance> findByCounsellorId(Long counsellorId);

    long countByCounsellorIdAndActionType(Long counsellorId, String actionType);

    long countByCounsellorId(Long counsellorId);
}