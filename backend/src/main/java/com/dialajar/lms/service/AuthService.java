package com.dialajar.lms.service;

import com.dialajar.lms.dto.request.LoginRequest;
import com.dialajar.lms.dto.response.LoginResponse;
import com.dialajar.lms.model.User;
import com.dialajar.lms.repository.UserRepository;
import com.dialajar.lms.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByNomorInduk(request.getNomorInduk());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Akun tidak ditemukan");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Password salah");
        }

        if (!user.getRole().equalsIgnoreCase(request.getRole())) {
            throw new RuntimeException("Role tidak sesuai");
        }

        String token = jwtUtil.generateToken(user);

        return new LoginResponse(user.getId(), token, user.getRole(), user.getNama(), user.getNomorInduk());
    }
}
