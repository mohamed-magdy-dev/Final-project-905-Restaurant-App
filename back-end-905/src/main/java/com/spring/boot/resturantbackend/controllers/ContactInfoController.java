package com.spring.boot.resturantbackend.controllers;

import com.spring.boot.resturantbackend.dto.ContactInfoDto;
import com.spring.boot.resturantbackend.services.ContactInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:4200")
public class ContactInfoController {

    @Autowired
    private ContactInfoService contactInfoService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody ContactInfoDto contactInfoDto) {
        try {
            ContactInfoDto savedMessage = contactInfoService.createContactInfo(contactInfoDto);
            return new ResponseEntity<>(savedMessage, HttpStatus.OK);
        } catch (RuntimeException e) {
          // if the error cause is from a profile .. then return a specific error message!
            if ("PROFILE_INCOMPLETE".equals(e.getMessage())) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN) // 403 Forbidden
                        .body(Collections.singletonMap("error", "PROFILE_INCOMPLETE"));
            }
            // أي خطأ تاني
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        // هنجيب اليوزر من التوكين (زي ما اتعلمنا)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        // دي دالة هنعملها في السيرفس حالاً
        long count = contactInfoService.countUnreadMessagesForUser(username);
        return ResponseEntity.ok(count);
    }

    // 2. لليوزر: عشان يشوف كل رسايله السابقة
    @GetMapping("/my-messages")
    public ResponseEntity<List<ContactInfoDto>> getMyMessages() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(contactInfoService.getMyMessages(username));
    }

    // 3. لليوزر: لما يفتح صفحة الرسايل، نعتبرها "اتقرت" عشان الجرس يطفي
    @PutMapping("/mark-read")
    public ResponseEntity<?> markMessagesAsRead() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        contactInfoService.markAllAsRead(username);
        return ResponseEntity.ok().build();
    }

    // 4. للأدمن: عشان يشوف كل رسايل الناس
    @GetMapping("/all")
    // @PreAuthorize("hasRole('ADMIN')") // لو عندك Roles فعل دي
    public ResponseEntity<List<ContactInfoDto>> getAllMessages() {
        return ResponseEntity.ok(contactInfoService.getAllMessages());
    }

    // 5. للأدمن: عشان يرد
    @PostMapping("/reply")
    public ResponseEntity<?> replyToMessage(@RequestBody ContactInfoDto replyDto) {
        contactInfoService.replyToMessage(replyDto);
        return ResponseEntity.ok().body("{\"message\": \"Reply sent successfully\"}");
    }
}