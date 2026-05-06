package com.system.controller;

import com.system.jwt.JwtService;
import com.system.model.Login;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Classe controller usado para a autenticação do spring security e jwt
 */
@RestController
@RequestMapping("/login")
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    // Construtor com injeção de dependências
    public LoginController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ResponseEntity<String> authenticator(@RequestBody Login login) {

        // Tenta autenticar o usuário
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(login.getUsername(), login.getPassword())
        );

        // Se a autenticação for bem-sucedida, gera o token
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken((UserDetails) authentication.getPrincipal());
            return ResponseEntity.ok(token);
        }

        // Caso contrário, lança uma exceção (Spring Security já faz isso por padrão)
        return ResponseEntity.status(401).body("Credenciais inválidas");
    }
}
