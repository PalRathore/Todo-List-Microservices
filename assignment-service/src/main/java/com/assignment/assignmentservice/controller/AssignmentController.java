package com.assignment.assignmentservice.controller;

import com.assignment.assignmentservice.model.Assignment;
import com.assignment.assignmentservice.service.AssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")   // IMPORTANT (no /assignment-service here)
public class AssignmentController {

    private final AssignmentService service;

    public AssignmentController(AssignmentService service) {
        this.service = service;
    }

    @PostMapping
    public Assignment add(@RequestBody Assignment a) {
        return service.addAssignment(a);
    }
    @GetMapping("/{id}")
    public Assignment getById(@PathVariable Long id) {
        return service.getAssignmentById(id);
    }
    @GetMapping
    public List<Assignment> all() {
        return service.getAllAssignments();
    }

    @PutMapping("/{id}/complete")
    public Assignment complete(@PathVariable Long id) {
        return service.markCompleted(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteAssignment(id);
    }
}