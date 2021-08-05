package com.example.mainproject.project;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@ToString
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class Project {

    @Id
    @SequenceGenerator(
            name = "projectlist_sequence",
            sequenceName = "projectlist_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "projectlist_sequence",
            strategy = GenerationType.SEQUENCE
    )
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String projectNo;

    @NotBlank
    @Column(nullable = false)
    private String projectCode;

    public Project(String name, String projectNo, String projectCode) {
        this.name = name;
        this.projectNo = projectNo;
        this.projectCode = projectCode;
    }
}