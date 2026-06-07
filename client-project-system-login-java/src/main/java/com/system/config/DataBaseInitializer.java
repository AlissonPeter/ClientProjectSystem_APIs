package com.system.config;
import com.system.model.Login;
import com.system.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Classe responsável para criar um admin de acesso no DB na tabela User caso não exista
 */
@Configuration
public class DataBaseInitializer {

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            // Garante que o usuário administrador 'alisson' exista e tenha a senha correta configurada
            var userOpt = loginRepository.findByUsername("alisson");
            Login adminLogin = userOpt.orElseGet(Login::new);
            
            System.out.println("Garantindo configuração do usuário administrador 'alisson'...");
            adminLogin.setUsername("alisson");
            adminLogin.setPassword(passwordEncoder.encode("alisson123"));
            adminLogin.setRole("ADMIN");

            loginRepository.save(adminLogin);
        };
    }
}
