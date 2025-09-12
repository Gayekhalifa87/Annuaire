package com.annuaire.khalifa.annuaire;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // PLUS BESOIN d'override addCorsMappings()
    // Le CorsFilter de KeycloakSecurityConfig gère déjà toutes les requêtes Angular
}
