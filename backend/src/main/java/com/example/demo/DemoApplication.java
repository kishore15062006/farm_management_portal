package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {

        String mongoUri = System.getenv("MONGO_URI");

        System.out.println("========== ENV TEST ==========");

        if (mongoUri == null) {
            System.out.println("MONGO_URI environment variable = NULL");
        } else {
            System.out.println("MONGO_URI environment variable = SET");
            System.out.println("Starts with: "
                    + mongoUri.substring(0, Math.min(21, mongoUri.length())));
        }

        System.out.println("==============================");

        var context = SpringApplication.run(DemoApplication.class, args);

        Environment env = context.getEnvironment();

        String springMongoUri = env.getProperty("spring.data.mongodb.uri");

        System.out.println("====== SPRING MONGO TEST ======");

        if (springMongoUri == null) {
            System.out.println("Spring Mongo URI = NULL");
        } else {
            System.out.println("Spring Mongo URI = SET");
            System.out.println("Starts with: "
                    + springMongoUri.substring(0, Math.min(21, springMongoUri.length())));
        }

        System.out.println("===============================");
    }
}