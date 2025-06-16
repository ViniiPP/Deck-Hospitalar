package br.login.api.apilogin.configs;


import br.login.api.apilogin.components.AuthTokens;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.WebSecurityConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ConfigSecurity implements WebMvcConfigurer {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthTokens authToken) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeRequests(auth -> auth
                        .requestMatchers("/ws/**").permitAll()

                )
                .addFilterBefore(authToken, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }





}
