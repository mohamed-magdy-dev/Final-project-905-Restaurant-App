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

    //  Helper Method: this is the key that will bring the correct name without repeating
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // to make sure .. if for some reason "Principal" is not AccountDTO
        if (authentication.getPrincipal() instanceof AccountDto) {
            AccountDto principal = (AccountDto) authentication.getPrincipal();
            return principal.getUsername();
        }
        // if not DTO then return the normal name
        return authentication.getName();
    }
    // send new message
    @Override
    public ContactInfoDto createContactInfo(ContactInfoDto contactInfoDto) {
        try {
            if (Objects.nonNull(contactInfoDto.getId())) {
                throw new RuntimeException("id.must_be.null");
            }
            String username = getCurrentUsername();
            Account account = accountRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // this is the important Method
            // it makes SURE that the user has completed his profile first!
            if (account.getAccountDetails() == null) {
                throw new RuntimeException("PROFILE_INCOMPLETE");
            }

            ContactInfo contactInfo = ContactInfoMapper.CONTACT_INFO_MAPPER.toContactInfo(contactInfoDto);
            contactInfo.setAccount(account);
            contactInfo.setMessageDate(LocalDateTime.now());
//            contactInfo.setName(contactInfoDto.getName());
//            contactInfo.setEmail(contactInfoDto.getEmail());

            // Get user information from the logged-in Account
            contactInfo.setName(account.getUsername());
            // Use the account email if your Account has an email field
            contactInfo.setEmail(account.getEmail());

            // Defaults
            contactInfo.setRead(true);
            contactInfo.setReplied(false);

            contactInfo = contactInfoRepo.save(contactInfo);
            return ContactInfoMapper.CONTACT_INFO_MAPPER.toContactInfoDto(contactInfo);

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    // notification count
    @Override
    public long countUnreadMessagesForUser(String usernameIgnored) {
        //Here we get the user (Info) from the token itself.. instead of what is coming from (String usernameIgnored)
        // to make sure it doesnt mix up
        String realUsername = getCurrentUsername();
        //debugging print
        //System.out.println("========== DEBUG COUNT START ==========");
       // System.out.println("User asking for count (FIXED): " + realUsername);

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

    //   show my messages
    @Override
    public List<ContactInfoDto> getMyMessages(String usernameIgnored) {
        String realUsername = getCurrentUsername();

        List<ContactInfo> messages = contactInfoRepo.findAllByAccount_UsernameOrderByMessageDateDesc(realUsername);
        return messages.stream()
                .map(ContactInfoMapper.CONTACT_INFO_MAPPER::toContactInfoDto)
                .collect(Collectors.toList());
    }

    // updating reading status
    @Override
    public void markAllAsRead(String usernameIgnored) {
        String realUsername = getCurrentUsername();
        List<ContactInfo> unreadMessages = contactInfoRepo.findAllByAccount_UsernameAndIsRepliedTrueAndIsReadFalse(realUsername);

        if (!unreadMessages.isEmpty()) {
            unreadMessages.forEach(msg -> msg.setRead(true));
            contactInfoRepo.saveAll(unreadMessages);
        }
    }

    //  Admin part .............................................................
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
        // when admin reply then set the values for notification
        message.setAdminReply(replyDto.getAdminReply());
        message.setReplyDate(LocalDateTime.now());
        message.setReplied(true);
        message.setRead(false);

        contactInfoRepo.save(message);
    }
}