package com.spring.boot.resturantbackend.controllers;

import com.spring.boot.resturantbackend.dto.ContactInfoDto;
import com.spring.boot.resturantbackend.services.ContactInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // 1. عشان نقول لسبرينج إن ده كلاس بيستقبل طلبات ويب
@RequestMapping("/api/contact") // 2. ده العنوان الرئيسي
@CrossOrigin(origins = "http://localhost:4200") // 3. عشان نسمح لأنجولار يكلم الباك إند
public class ContactInfoController {

    @Autowired
    private ContactInfoService contactInfoService;

    // دي الميثود اللي هتستقبل الرسالة
    @PostMapping("/send")
    public ResponseEntity<ContactInfoDto> sendMessage(@RequestBody ContactInfoDto contactInfoDto) {
        // بننادي السيرفس اللي أنت كاتبها أصلاً
        ContactInfoDto savedMessage = contactInfoService.createContactInfo(contactInfoDto);

        // بنرجع الداتا اللي اتحفظت مع كود 200 OK
        return new ResponseEntity<>(savedMessage, HttpStatus.OK);
    }
}