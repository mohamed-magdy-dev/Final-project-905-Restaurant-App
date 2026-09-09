package com.spring.boot.resturantbackend.controllers.security;

import com.spring.boot.resturantbackend.controllers.vm.Security.LoginRequestVm;
import com.spring.boot.resturantbackend.controllers.vm.Security.SignupRequestVm;
import com.spring.boot.resturantbackend.controllers.vm.Security.AccountAuthResponseVm;
import com.spring.boot.resturantbackend.dto.ExceptionDto;
import com.spring.boot.resturantbackend.services.security.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.SystemException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@Tag(name = "Auth Controller", description = "Sign up, login")
@RequestMapping("/auth") // has mapping
@RestController
@CrossOrigin("http://localhost:4200")
public class AuthController { // receives request and sends it to Service

    @Autowired
    private AuthService authService;

    @Operation(summary = "sign up")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Http Status sign up"),
            @ApiResponse(responseCode = "500", description = "Http Status internal server error",
                    content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    @PostMapping("/sign-up") // endpoint for sign-up .. same as login: POST /auth/sign-up
    public ResponseEntity<AccountAuthResponseVm> signUp(
            @RequestBody @Valid SignupRequestVm vm) throws SystemException {

        return ResponseEntity
                .created(URI.create("/sign-up"))
                .body(authService.signUp(vm));
    }

    @Operation(summary = "login")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Http Status login"),
            @ApiResponse(responseCode = "500", description = "Http Status internal server error",
                    content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    @PostMapping("/login") // endpoint for login "POST /auth/login"
    // takes login request from angular --> passes to authService
    public ResponseEntity<AccountAuthResponseVm> login(
            @RequestBody @Valid LoginRequestVm vm) throws SystemException {

        return ResponseEntity.ok(authService.login(vm)); //as shown here! authService.login
    }
}
