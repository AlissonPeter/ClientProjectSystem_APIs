package com.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.sql.SQLException;

@SpringBootApplication
public class ClientProjectSystemApplication {

	public static void main(String[] args) throws SQLException {
		SpringApplication.run(ClientProjectSystemApplication.class, args);
	}

}
