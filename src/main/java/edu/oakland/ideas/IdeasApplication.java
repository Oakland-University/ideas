package edu.oakland.ideas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.apereo.portal.soffit.renderer.SoffitApplication;
import org.springframework.context.annotation.ComponentScan;

@SoffitApplication
@SpringBootApplication
@ComponentScan(basePackages = {"edu.oakland"})
public class IdeasApplication {

	public static void main(String[] args) {
		SpringApplication.run(IdeasApplication.class, args);
	}
}
