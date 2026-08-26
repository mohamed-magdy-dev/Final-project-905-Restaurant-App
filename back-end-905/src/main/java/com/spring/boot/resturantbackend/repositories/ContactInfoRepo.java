package com.spring.boot.resturantbackend.repositories;

import com.spring.boot.resturantbackend.models.ContactInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactInfoRepo extends JpaRepository<ContactInfo, Long> {

    List<ContactInfo> findAllByAccount_UsernameOrderByMessageDateDesc(String username);


    List<ContactInfo> findAllByAccount_UsernameAndIsRepliedTrueAndIsReadFalse(String username);

    //  كل الرسايل للأدمن
    List<ContactInfo> findAllByOrderByMessageDateDesc();
}
