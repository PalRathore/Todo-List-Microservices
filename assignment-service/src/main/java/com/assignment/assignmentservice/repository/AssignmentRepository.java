package com.assignment.assignmentservice.repository;

import com.assignment.assignmentservice.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
}