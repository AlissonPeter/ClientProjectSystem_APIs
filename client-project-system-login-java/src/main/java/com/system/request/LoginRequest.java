package com.system.request;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "O nome de usuário não pode estar vazio")
        String username,

        @NotBlank(message = "A senha não pode estar vazia")
        String password
) {}
