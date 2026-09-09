package com.spring.boot.resturantbackend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.context.annotation.Configuration;


@OpenAPIDefinition(
        info = @Info(
                title = "Restaurant Endpoints",
                description = "all apis for Restaurant",
                contact = @Contact(
                        name = "Mohamed Magdy",
                        email = "mohamedmagdyabdelaaty@gmail.com",
                        url = "https://www.linkedin.com/in/mohamed-magdy97/"
                ),
                license = @License(
                        name = "restaurant license",
                        url = "http://localhost:4200"
                ),
                version = "1"
        )
)
@Configuration
public class SwaggerConfiguration {
}
