package com.spring.boot.resturantbackend.repositories;

import com.spring.boot.resturantbackend.models.ContactInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactInfoRepo extends JpaRepository<ContactInfo, Long> {
    // 1. كل رسايل اليوزر (للعد وللعرض)
    List<ContactInfo> findAllByAccount_UsernameOrderByMessageDateDesc(String username);

    // 2. الرسايل الغير مقروءة فقط (عشان نعلم عليها إنها اتقرت)
    List<ContactInfo> findAllByAccount_UsernameAndIsRepliedTrueAndIsReadFalse(String username);

    // 3. كل الرسايل للأدمن
    List<ContactInfo> findAllByOrderByMessageDateDesc();
}
