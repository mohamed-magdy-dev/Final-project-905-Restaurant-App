package com.spring.boot.resturantbackend.controllers.vm.Security;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestVm {

    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
