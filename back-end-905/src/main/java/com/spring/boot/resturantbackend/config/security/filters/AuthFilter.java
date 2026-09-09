package com.spring.boot.resturantbackend.config.security.filters;

import com.spring.boot.resturantbackend.config.security.TokenHandler;
import com.spring.boot.resturantbackend.dto.security.AccountDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.SystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Component
public class AuthFilter extends OncePerRequestFilter {
    @Lazy
    @Autowired
    private TokenHandler tokenHandler;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = request.getHeader("Authorization");

            if (Objects.isNull(token) || !token.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }
            token = token.substring(7);
            AccountDto userValidated = tokenHandler.validateToken(token);

            if (Objects.isNull(userValidated)) {
                filterChain.doFilter(request, response);
                return;
            }
            //  get roles
            List<SimpleGrantedAuthority> roles = userValidated.getRoles().stream().map(
                    role -> new SimpleGrantedAuthority("ROLE_" + role.getRole())
            ).toList();

            //  encapsulate user data
            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                    userValidated,
                    userValidated.getPassword(),
                    roles
            );
            //  Set Authentication
            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            //  Continue
            filterChain.doFilter(request, response);

        } catch (SystemException e) {
            filterChain.doFilter(request, response);
        }
    }

    // "shouldNotFilter" is to control the filters :
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.contains("/auth") ||
                path.contains("/swagger-ui") ||
                path.contains("/v3") ||
                path.contains("/products") ||
                path.contains("/categories") ||
                path.contains("/images");
    }
}
