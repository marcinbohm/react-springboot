package com.example.mainproject.project;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/projectslist")
@AllArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<Project> getAllProjects() {
//        throw new IllegalStateException("error");
        return projectService.getAllProjects();
    }

    @PostMapping
    public void addProject(@Valid @RequestBody Project project) {
        projectService.addProject(project);
    }

    @PutMapping
    public void updateProject(@Valid @RequestBody Project project) {
        projectService.updateProject(project);
    }

    @DeleteMapping(path = "{projectId}")
    public void deleteProject(
            @PathVariable("projectId") Long projectId) {
        projectService.deleteProject(projectId);
    }
}