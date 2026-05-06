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
            // Verifica se o usuário 'admin' já existe
            if (loginRepository.findByUsername("alisson").isEmpty()) {
                System.out.println("Criando usuário administrador padrão...");

                // Cria a entidade de usuário
                Login adminLogin = new Login();
                adminLogin.setUsername("alisson");
                // Criptografa a senha antes de salvar
                adminLogin.setPassword(passwordEncoder.encode("alisson123"));
                adminLogin.setRole("ADMIN");

                // Salva o usuário no banco de dados
                loginRepository.save(adminLogin);
            }
        };
    }
}
