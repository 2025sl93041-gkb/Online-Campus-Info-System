package com.onlinecampusinfo.service;

import com.onlinecampusinfo.dto.request.QueryRequest;
import com.onlinecampusinfo.model.College;
import com.onlinecampusinfo.model.Query;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.model.enums.QueryStatus;
import com.onlinecampusinfo.model.enums.UserRole;
import com.onlinecampusinfo.repository.CollegeRepository;
import com.onlinecampusinfo.repository.QueryRepository;
import com.onlinecampusinfo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QueryService {

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Query raiseQuery(QueryRequest request, User student) {
        Query query = Query.builder()
                .student(student)
                .subject(request.getSubject())
                .message(request.getMessage())
                .status(QueryStatus.OPEN)
                .build();

        if (request.getCollegeId() != null) {
            College college = collegeRepository.findById(request.getCollegeId())
                    .orElseThrow(() -> new RuntimeException("College not found"));
            query.setCollege(college);
        }

        // Auto-assign to a counsellor (round-robin or first available)
        List<User> counsellors = userRepository.findByRole(UserRole.COUNSELLOR);
        if (!counsellors.isEmpty()) {
            // Simple assignment: pick counsellor with least queries
            User assignedCounsellor = counsellors.get(0);
            long minQueries = Long.MAX_VALUE;
            for (User c : counsellors) {
                long count = queryRepository.countByCounsellorId(c.getId());
                if (count < minQueries) {
                    minQueries = count;
                    assignedCounsellor = c;
                }
            }
            query.setCounsellor(assignedCounsellor);
        }

        return queryRepository.save(query);
    }

    public List<Query> getMyQueries(Long studentId) {
        return queryRepository.findByStudentId(studentId);
    }

    public List<Query> getAssignedQueries(Long counsellorId) {
        return queryRepository.findByCounsellorId(counsellorId);
    }

    public Query getQueryById(Long id) {
        return queryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Query not found"));
    }

    @Transactional
    public Query respondToQuery(Long id, String response, User counsellor) {
        Query query = getQueryById(id);
        if (query.getCounsellor() == null || !query.getCounsellor().getId().equals(counsellor.getId())) {
            throw new RuntimeException("You are not assigned to this query");
        }
        query.setResponse(response);
        query.setStatus(QueryStatus.RESOLVED);
        query.setRespondedAt(LocalDateTime.now());
        return queryRepository.save(query);
    }

    @Transactional
    public Query closeQuery(Long id, User student) {
        Query query = getQueryById(id);
        if (!query.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("You can only close your own queries");
        }
        query.setStatus(QueryStatus.CLOSED);
        return queryRepository.save(query);
    }
}