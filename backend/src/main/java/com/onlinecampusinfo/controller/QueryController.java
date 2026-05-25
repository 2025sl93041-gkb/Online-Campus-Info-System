package com.onlinecampusinfo.controller;

import com.onlinecampusinfo.dto.request.QueryRequest;
import com.onlinecampusinfo.dto.request.QueryResponseRequest;
import com.onlinecampusinfo.dto.response.MessageResponse;
import com.onlinecampusinfo.model.Query;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.service.AuthService;
import com.onlinecampusinfo.service.QueryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/queries")
public class QueryController {

    @Autowired
    private QueryService queryService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> raiseQuery(@Valid @RequestBody QueryRequest request) {
        User student = authService.getCurrentUser();
        Query query = queryService.raiseQuery(request, student);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapQueryToResponse(query));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Map<String, Object>>> getMyQueries() {
        User student = authService.getCurrentUser();
        List<Query> queries = queryService.getMyQueries(student.getId());
        return ResponseEntity.ok(queries.stream().map(this::mapQueryToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<Map<String, Object>>> getAssignedQueries() {
        User counsellor = authService.getCurrentUser();
        List<Query> queries = queryService.getAssignedQueries(counsellor.getId());
        return ResponseEntity.ok(queries.stream().map(this::mapQueryToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getQueryById(@PathVariable Long id) {
        Query query = queryService.getQueryById(id);
        return ResponseEntity.ok(mapQueryToResponse(query));
    }

    @PutMapping("/{id}/respond")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<?> respondToQuery(@PathVariable Long id, @Valid @RequestBody QueryResponseRequest request) {
        User counsellor = authService.getCurrentUser();
        Query query = queryService.respondToQuery(id, request.getResponse(), counsellor);
        return ResponseEntity.ok(mapQueryToResponse(query));
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> closeQuery(@PathVariable Long id) {
        User student = authService.getCurrentUser();
        Query query = queryService.closeQuery(id, student);
        return ResponseEntity.ok(mapQueryToResponse(query));
    }

    private Map<String, Object> mapQueryToResponse(Query query) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", query.getId());
        map.put("studentId", query.getStudent().getId());
        map.put("studentName", query.getStudent().getName());
        map.put("subject", query.getSubject());
        map.put("message", query.getMessage());
        map.put("response", query.getResponse());
        map.put("status", query.getStatus());
        map.put("createdAt", query.getCreatedAt());
        map.put("respondedAt", query.getRespondedAt());

        if (query.getCounsellor() != null) {
            map.put("counsellorId", query.getCounsellor().getId());
            map.put("counsellorName", query.getCounsellor().getName());
        }
        if (query.getCollege() != null) {
            map.put("collegeId", query.getCollege().getId());
            map.put("collegeName", query.getCollege().getName());
        }
        return map;
    }
}