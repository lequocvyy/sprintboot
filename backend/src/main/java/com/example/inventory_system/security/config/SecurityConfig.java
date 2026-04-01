package com.example.inventory_system.security.config;

import com.example.inventory_system.security.jwt.JwtAuthenticationFilter;
import com.example.inventory_system.security.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService,
                          PasswordEncoder passwordEncoder,
                          JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.customUserDetailsService = customUserDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/auth/public/**").permitAll()
        .requestMatchers(HttpMethod.POST, "/api/auth/public/**").permitAll()

        .requestMatchers(HttpMethod.GET, "/api/shop-requests/pending").hasAuthority("PLATFORM_ADMIN")
        .requestMatchers(HttpMethod.POST, "/api/shop-requests/*/approve").hasAuthority("PLATFORM_ADMIN")
        .requestMatchers(HttpMethod.POST, "/api/shop-requests").hasAuthority("SHOP_OWNER")

        .requestMatchers("/api/users/staff/**").hasAuthority("SHOP_OWNER")

        .requestMatchers(HttpMethod.GET, "/api/warehouses/**")
        .hasAnyAuthority("SHOP_OWNER", "SHOP_MANAGER", "SHOP_STAFF")
        .requestMatchers("/api/warehouses/**")
        .hasAnyAuthority("SHOP_OWNER", "SHOP_MANAGER")

        .requestMatchers(HttpMethod.GET, "/api/products/**")
        .hasAnyAuthority("SHOP_OWNER", "SHOP_MANAGER", "SHOP_STAFF")
        .requestMatchers("/api/products/**")
        .hasAnyAuthority("SHOP_OWNER", "SHOP_MANAGER")

        .requestMatchers("/api/transactions/**")
        .hasAnyAuthority("SHOP_OWNER", "SHOP_MANAGER", "SHOP_STAFF")

        .requestMatchers("/api/orders/**")
        .hasAnyAuthority("SHOP_OWNER", "SHOP_MANAGER", "SHOP_STAFF")

        .anyRequest().authenticated()
)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    

}