package com.spring.boot.resturantbackend.controllers.vm.Security;
import com.spring.boot.resturantbackend.annotation.ValidPhone;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AccountAuthRequestVm {
    private Long id;
    @NotEmpty(message = "not_empty.username")
    @Size(min = 7, message = "size.username")
    private String username;

    @NotEmpty(message = "email.required")
    @Email(message = "email.invalid")
    private String email;

    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{7,}$",
            message = "error.password"
    )
    private String password;


//    @ValidPhone
//    private String phone;
}
