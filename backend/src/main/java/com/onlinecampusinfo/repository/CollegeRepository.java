package com.onlinecampusinfo.repository;

import com.onlinecampusinfo.model.College;
import com.onlinecampusinfo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {

    List<College> findByAdmin(User admin);

    List<College> findByAdminId(Long adminId);

    @Query("SELECT c FROM College c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.city) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.state) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<College> searchColleges(@Param("query") String query);
}