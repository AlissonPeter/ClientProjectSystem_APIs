package com.system.model;
import jakarta.persistence.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Collections;

@Entity
@Table
public class Login implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // Você pode adicionar um campo para os papéis (roles) do usuário
    // Por simplicidade, vamos usar uma string fixa como exemplo.
    private String role;

    // Construtores
    public Login() {}

    public Login(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    // Métodos da interface UserDetails

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Retorna a autoridade (papel) do usuário
        // O papel precisa ter o prefixo "ROLE_" para ser reconhecido pelo Spring Security
        return Collections.singletonList(() -> "ROLE_" + this.role);
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Retorna 'true' para indicar que a conta não expirou
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Retorna 'true' para indicar que a conta não está bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Retorna 'true' para indicar que as credenciais não expiraram
    }

    @Override
    public boolean isEnabled() {
        return true; // Retorna 'true' para indicar que o usuário está habilitado
    }
}