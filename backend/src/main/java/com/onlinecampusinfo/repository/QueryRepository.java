package com.onlinecampusinfo.repository;

import com.onlinecampusinfo.model.Query;
import com.onlinecampusinfo.model.enums.QueryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QueryRepository extends JpaRepository<Query, Long> {

    List<Query> findByStudentId(Long studentId);

    List<Query> findByCounsellorId(Long counsellorId);

    List<Query> findByStatus(QueryStatus status);

    List<Query> findByCounsellorIdAndStatus(Long counsellorId, QueryStatus status);

    long countByStatus(QueryStatus status);

    long countByCounsellorId(Long counsellorId);
}