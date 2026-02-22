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

    @PostMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody UpdateProfileRequest request) {

        // 1️⃣ التصحيح: استلام اليوزر كـ AccountDto مش String
        // احنا واثقين إنه AccountDto لأن الـ AuthFilter هو اللي حاطه
        AccountDto currentUser = (AccountDto) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // بناخد الاسم منه عشان ندور في الداتا بيز
        String username = currentUser.getUsername();

        Account account = accountRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // 2️⃣ نشوف عنده AccountDetails ولا لأ
        AccountDetails details = account.getAccountDetails();

        // حل وقائي: لو العلاقة مش بتحمل التفاصيل (Lazy Loading)، نجيبها يدوياً
        if (details == null) {
            details = accountDetailsRepo.findByAccount_Id(account.getId());
        }

        if (details == null) {
            details = new AccountDetails();
            details.setAccount(account);
        }

        // 3️⃣ نعمل Update
        details.setPhoneNumber(request.getPhoneNumber());
        details.setAddress(request.getAddress());
        details.setAge(request.getAge());

        accountDetailsRepo.save(details);

        return ResponseEntity.ok("Profile updated successfully");
    }
}