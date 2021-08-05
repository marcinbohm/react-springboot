package com.example.mainproject.project;

import com.example.mainproject.exception.BadRequestException;
import com.example.mainproject.exception.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public void addProject(Project project) {
        Boolean existsEmail = projectRepository
                .selectExistsProject(project.getProjectNo());
        if (existsEmail) {
            throw new BadRequestException(
                    "Project " + project.getProjectNo() + " already exists");
        }

        projectRepository.save(project);
    }

    public void deleteProject(Long projectId) {
        if(!projectRepository.existsById(projectId)) {
            throw new StudentNotFoundException(
                    "Project with id " + projectId + " does not exists");
        }
        projectRepository.deleteById(projectId);
    }

    public void updateProject(Project project) {
        if(!projectRepository.existsById(project.getId())) {
            throw new StudentNotFoundException(
                    "Project with id " + project.getId() + " does not exists");
        }

        projectRepository.updateProject(project.getId(),
                project.getName(),
                project.getProjectNo(),
                project.getProjectCode());
    }
}
