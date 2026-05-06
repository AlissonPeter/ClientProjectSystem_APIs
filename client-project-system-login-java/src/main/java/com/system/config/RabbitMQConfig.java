package com.system.config;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String PROJECTS_SELECTED = "projects_selected";
    @Bean
    public Queue filaEstoque() {
        // nome da fila, se é durável (sobrevive ao restart do Docker)
        return new Queue(PROJECTS_SELECTED, true);
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}