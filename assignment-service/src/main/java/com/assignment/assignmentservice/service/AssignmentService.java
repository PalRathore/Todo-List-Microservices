package com.assignment.assignmentservice.service;

import com.assignment.assignmentservice.model.Assignment;
import com.assignment.assignmentservice.repository.AssignmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository repo;

    public AssignmentService(AssignmentRepository repo) {
        this.repo = repo;
    }

    public Assignment addAssignment(Assignment a) {
        if (a.getStatus() == null) a.setStatus("Pending");
        return repo.save(a);
    }

    public List<Assignment> getAllAssignments() {
        return repo.findAll();
    }

    public void deleteAssignment(Long id) {
        repo.deleteById(id);
    }

    public Assignment markCompleted(Long id) {
        Assignment a = repo.findById(id).orElseThrow();
        a.setStatus("Completed");
        return repo.save(a);
    }
    public Assignment getAssignmentById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
    }

    }
