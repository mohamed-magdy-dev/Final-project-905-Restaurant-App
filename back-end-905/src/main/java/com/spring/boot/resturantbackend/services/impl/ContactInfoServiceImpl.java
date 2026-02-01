package com.spring.boot.resturantbackend.services.impl;

import com.spring.boot.resturantbackend.dto.ContactInfoDto;
import com.spring.boot.resturantbackend.dto.security.AccountDto;
import com.spring.boot.resturantbackend.mappers.ContactInfoMapper;
import com.spring.boot.resturantbackend.models.ContactInfo;
import com.spring.boot.resturantbackend.models.security.Account;
import com.spring.boot.resturantbackend.repositories.ContactInfoRepo;
import com.spring.boot.resturantbackend.repositories.security.AccountRepo;
import com.spring.boot.resturantbackend.services.ContactInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ContactInfoServiceImpl implements ContactInfoService {

    @Autowired
    private ContactInfoRepo contactInfoRepo;

    @Autowired
    private AccountRepo accountRepo;

    // =========================================================================
    //  Helper Method: دي "المفتاح" اللي بيجيب الاسم الصح من غير تكرار
    // =========================================================================
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // تأمين: لو لسبب ما الـ Principal مش AccountDto (زي AnonymousUser)
        if (authentication.getPrincipal() instanceof AccountDto) {
            AccountDto principal = (AccountDto) authentication.getPrincipal();
            return principal.getUsername();
        }

        // لو مش DTO، رجع الاسم العادي (احتياطي)
        return authentication.getName();
    }

    // =========================================================================
    //  1. إرسال رسالة جديدة
    // =========================================================================
    @Override
    public ContactInfoDto createContactInfo(ContactInfoDto contactInfoDto) {
        try {
            if (Objects.nonNull(contactInfoDto.getId())) {
                throw new RuntimeException("id.must_be.null");
            }

            // التعديل: استخدمنا الدالة المساعدة
            String username = getCurrentUsername();

            Account account = accountRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (account.getAccountDetails() == null) {
                throw new RuntimeException("PROFILE_INCOMPLETE");
            }

            ContactInfo contactInfo = ContactInfoMapper.CONTACT_INFO_MAPPER.toContactInfo(contactInfoDto);
            contactInfo.setAccount(account);
            contactInfo.setMessageDate(LocalDateTime.now());
            contactInfo.setName(contactInfoDto.getName());
            contactInfo.setEmail(contactInfoDto.getEmail());

            // Defaults
            contactInfo.setRead(true);
            contactInfo.setReplied(false);

            contactInfo = contactInfoRepo.save(contactInfo);
            return ContactInfoMapper.CONTACT_INFO_MAPPER.toContactInfoDto(contactInfo);

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    // =========================================================================
    //  2. عداد النوتيفيكشن (The Fix is HERE)
    // =========================================================================
    @Override
    public long countUnreadMessagesForUser(String usernameIgnored) {
        // ملحوظة: احنا تجاهلنا المتغير اللي جاي في الباراميتر وهنجيب اليوزر الحقيقي من التوكين
        // عشان نضمن ان مفيش حد بيجيب رسايل حد تاني
        String realUsername = getCurrentUsername();
        //debugging print 
        System.out.println("========== DEBUG COUNT START ==========");
        System.out.println("User asking for count (FIXED): " + realUsername);

        List<ContactInfo> allMessages = contactInfoRepo.findAllByAccount_UsernameOrderByMessageDateDesc(realUsername);

        System.out.println("Total messages found in DB: " + allMessages.size());

        long count = 0;
        for (ContactInfo msg : allMessages) {
            if (msg.isReplied() && !msg.isRead()) {
                count++;
            }
        }
        System.out.println("Final Count: " + count);
        return count;
    }

    // =========================================================================
    //  3 -- show my messages
    // =========================================================================
    @Override
    public List<ContactInfoDto> getMyMessages(String usernameIgnored) {
        String realUsername = getCurrentUsername(); // التعديل هنا

        List<ContactInfo> messages = contactInfoRepo.findAllByAccount_UsernameOrderByMessageDateDesc(realUsername);
        return messages.stream()
                .map(ContactInfoMapper.CONTACT_INFO_MAPPER::toContactInfoDto)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // 4. updating reading status
    // =========================================================================
    @Override
    public void markAllAsRead(String usernameIgnored) {
        String realUsername = getCurrentUsername(); // التعديل هنا

        List<ContactInfo> unreadMessages = contactInfoRepo.findAllByAccount_UsernameAndIsRepliedTrueAndIsReadFalse(realUsername);

        if (!unreadMessages.isEmpty()) {
            unreadMessages.forEach(msg -> msg.setRead(true));
            contactInfoRepo.saveAll(unreadMessages);
        }
    }

    // =========================================================================
    //  Admin stuff (still the same)
    // =========================================================================
    @Override
    public List<ContactInfoDto> getAllMessages() {
        return contactInfoRepo.findAllByOrderByMessageDateDesc().stream()
                .map(ContactInfoMapper.CONTACT_INFO_MAPPER::toContactInfoDto)
                .collect(Collectors.toList());
    }

    @Override
    public void replyToMessage(ContactInfoDto replyDto) {
        ContactInfo message = contactInfoRepo.findById(replyDto.getId())
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setAdminReply(replyDto.getAdminReply());
        message.setReplyDate(LocalDateTime.now());
        message.setReplied(true);
        message.setRead(false);

        contactInfoRepo.save(message);
    }
}