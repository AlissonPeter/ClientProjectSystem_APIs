package com.system;

import com.system.model.Client;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.function.Function;

import java.sql.DriverManager;
import java.sql.SQLException;

@SpringBootApplication
public class ClientProjectSystemApplication {

	public static void main(String[] args) throws SQLException {
		SpringApplication.run(ClientProjectSystemApplication.class, args);
	}

}
