package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {

        String mongoUri = System.getenv("MONGO_URI");

        if (mongoUri == null) {
            System.out.println("========== MONGO_URI IS NULL ==========");
        } else {
            System.out.println("========== MONGO_URI IS SET ==========");
            System.out.println("Starts with: " +
                    mongoUri.substring(0, Math.min(15, mongoUri.length())));
        }

        SpringApplication.run(DemoApplication.class, args);
    }
}