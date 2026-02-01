package com.spring.boot.resturantbackend.services;

import com.spring.boot.resturantbackend.dto.ContactInfoDto;

import java.util.List;

public interface ContactInfoService {
    ContactInfoDto createContactInfo(ContactInfoDto contactInfoDto);

    long countUnreadMessagesForUser(String username);

    List<ContactInfoDto> getMyMessages(String username);

    void markAllAsRead(String username);

    List<ContactInfoDto> getAllMessages(); // للأدمن

    void replyToMessage(ContactInfoDto replyDto); // للأدمن
}
