package de.neuefische.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.environment}")
    private String environment;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.ALWAYS))
                .authorizeHttpRequests(r ->
                        r.requestMatchers(HttpMethod.GET, "/api/todo").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/todo").authenticated()
                                .anyRequest().permitAll())
                .oauth2Login(o -> {
                    try {
                        o.init(http);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    if (environment.equals("dev")) {
                        o.defaultSuccessUrl("http://localhost:5173", true);
                    } else {
                        o.defaultSuccessUrl("/", true);
                    }
                })
                .logout(l -> l.logoutUrl("/api/logout")
                        .logoutSuccessHandler(((request, response, authentication) -> response.setStatus(200)))
                );

        return http.build();
    }
}
