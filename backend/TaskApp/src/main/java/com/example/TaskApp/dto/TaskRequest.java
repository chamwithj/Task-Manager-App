package com.example.TaskApp.dto;

import com.example.TaskApp.enums.Priority;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TaskRequest {

    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;

    @Size(max = 550, message = "Title must be less than 550 characters")
    private String description;

    @NotNull(message = "status must be required")
    private Boolean completed;

    @NotNull(message = "priority is required")
    private Priority priority;

    @FutureOrPresent(message = "due date must be today or future")
    private LocalDate dueDate;

}
