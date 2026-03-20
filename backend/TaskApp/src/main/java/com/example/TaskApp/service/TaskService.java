package com.example.TaskApp.service;

import com.example.TaskApp.dto.Response;
import com.example.TaskApp.dto.TaskRequest;
import com.example.TaskApp.entity.Task;
import com.example.TaskApp.entity.User;
import com.example.TaskApp.enums.Priority;
import com.example.TaskApp.exceptions.NotFoundException;
import com.example.TaskApp.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserService userService;


    public Response<Task> createTask(TaskRequest taskRequest) {
        log.info("create task");

        User user = userService.getCurrentLoggedInUser();
        Task taskToSave = Task.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .completed(taskRequest.getCompleted())
                .priority(taskRequest.getPriority())
                .dueDate(taskRequest.getDueDate())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .user(user)
                .build();

        Task saveTask = taskRepository.save(taskToSave);

        return Response.<Task>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Task is created successfully")
                .data(saveTask)
                .build();
    }


    public Response<List<Task>> getAllTasks() {
        log.info("Get all my task");

        User currentUser = userService.getCurrentLoggedInUser();
        List<Task> tasks = taskRepository.findByUser(currentUser, Sort.by(Sort.Direction.DESC, "id"));

        return Response.<List<Task>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("All task retrieve successfully")
                .data(tasks)
                .build();
    }


    public Response<Task> getTaskById(Long id) {
        log.info("Task By id trigger");

        Task task = taskRepository.findById(id)
                .orElseThrow(()->new NotFoundException("Task Not found"));

        return Response.<Task>builder()
                .statusCode(HttpStatus.OK.value())
                .message("task retrieve successfully")
                .data(task)
                .build();
    }


    public Response<Task> updateTask(TaskRequest taskRequest) {
        log.info("Update task trigger");

        Task task = taskRepository.findById(taskRequest.getId())
                .orElseThrow(()->new NotFoundException("Task not found"));

        if(taskRequest.getTitle() != null) task.setTitle(taskRequest.getTitle());
        if(taskRequest.getDescription() != null) task.setDescription(taskRequest.getDescription());
        if(taskRequest.getCompleted() != null) task.setCompleted(taskRequest.getCompleted());
        if(taskRequest.getPriority() != null) task.setPriority(taskRequest.getPriority());
        if(taskRequest.getDueDate() != null) task.setDueDate(taskRequest.getDueDate());

        task.setUpdatedAt(LocalDateTime.now());

        //update task in db

        Task updateTask = taskRepository.save(task);

        return Response.<Task>builder()
                .statusCode(HttpStatus.OK.value())
                .message("task update successfully")
                .data(updateTask)
                .build();

    }


    public Response<Void> deleteTask(Long id) {
        log.info("Delete task trigger");

        if(!taskRepository.existsById(id)){
            throw new NotFoundException("Task is not found");
        }

        taskRepository.deleteById(id);

        return Response.<Void>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Task deleted successfully")
                .build();
    }


    @Transactional
    public Response<List<Task>> getTasksByCompletionStatus(boolean completed) {
        log.info(" getTasksByCompletionStatus trigger");

        User currentUser = userService.getCurrentLoggedInUser();

        List<Task> tasks = taskRepository.findByCompletedAndUser(completed, currentUser);

        return Response.<List<Task>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Task filtered by completed status successfully")
                .data(tasks)
                .build();

    }


    public Response<List<Task>> getTasksByPriority(String priority) {
        log.info(" getTasksByPriority trigger");

        User currentUser = userService.getCurrentLoggedInUser();
        Priority priorityEnum = Priority.valueOf(priority.toUpperCase());

        List<Task> tasks = taskRepository.findByPriorityAndUser(priorityEnum, currentUser,Sort.by(Sort.Direction.DESC,"id"));

        return Response.<List<Task>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Task filtered by priority successfully")
                .data(tasks)
                .build();

    }

}
