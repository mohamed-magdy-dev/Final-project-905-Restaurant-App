package com.spring.boot.resturantbackend.controllers;

import com.spring.boot.resturantbackend.controllers.vm.UpdateProfileRequest;
import com.spring.boot.resturantbackend.dto.security.AccountDto; // تأكد إن الـ import ده موجود
import com.spring.boot.resturantbackend.models.security.Account;
import com.spring.boot.resturantbackend.models.security.AccountDetails;
import com.spring.boot.resturantbackend.repositories.security.AccountDetailsRepo;
import com.spring.boot.resturantbackend.repositories.security.AccountRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
@CrossOrigin("http://localhost:4200")
public class AccountController {

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private AccountDetailsRepo accountDetailsRepo;

    @PostMapping("/profile") // account/profile
    public ResponseEntity<String> updateProfile(@RequestBody UpdateProfileRequest request) {

        AccountDto currentUser = (AccountDto) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username = currentUser.getUsername();

        Account account = accountRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        AccountDetails details = account.getAccountDetails();

        if (details == null) {
            details = accountDetailsRepo.findByAccount_Id(account.getId());
        }
        if (details == null) {
            details = new AccountDetails();
            details.setAccount(account);
        }
        details.setPhoneNumber(request.getPhoneNumber());
        details.setAddress(request.getAddress());
        details.setAge(request.getAge());

        accountDetailsRepo.save(details);
        return ResponseEntity.ok("Profile updated successfully");
    }
}