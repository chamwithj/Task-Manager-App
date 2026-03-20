package com.example.TaskApp.service;

import com.example.TaskApp.dto.Response;
import com.example.TaskApp.dto.UserRequest;
import com.example.TaskApp.entity.User;
import com.example.TaskApp.enums.Role;
import com.example.TaskApp.exceptions.BadRequestException;
import com.example.TaskApp.exceptions.NotFoundException;
import com.example.TaskApp.repository.UserRepository;
import com.example.TaskApp.security.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;


    public Response<?> signUp(UserRequest userRequest) {
        log.info("Inside signUp");
        Optional<User> existingUser = userRepository.findByUsername(userRequest.getUsername());

        if(existingUser.isPresent()){
            throw new BadRequestException("User name already exist");
        }

        User user = new User();
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setRole(Role.USER);
        user.setUsername(userRequest.getUsername());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));


        userRepository.save(user);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("User registered successfully")
                .build();
    }


    public Response<?> login(UserRequest userRequest) {
        log.info("inside login");

        User user = userRepository.findByUsername(userRequest.getUsername())
                .orElseThrow(()-> new NotFoundException("User Not found"));

        if(!passwordEncoder.matches(userRequest.getPassword(), user.getPassword())){
            throw new BadRequestException("Invalid password");
        }

        String token = jwtUtils.generateToken(user.getUsername());

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Login successful")
                .data(token)
                .build();
    }


    public User getCurrentLoggedInUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByUsername(username).orElseThrow(()->new NotFoundException("User Not found"));
    }

}
