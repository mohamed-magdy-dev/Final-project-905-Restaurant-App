package com.spring.boot.resturantbackend.models;

import com.spring.boot.resturantbackend.models.security.Account;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(schema = "hr")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ContactInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, length = 1000)
    private String message;

    // this is for the admin ----------------------

    @Column(length = 1000)
    private String adminReply; //Admin reply

    private LocalDateTime messageDate;

    private LocalDateTime replyDate;

// ------------------------------------------------------
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

// -------------------------------------------------------

    @Column(name = "IS_READ",columnDefinition = "number(1) default 0") // أو boolean حسب الداتا بيز، بس ده عشان أوراكل أحياناً
    private boolean isRead = false;


    @Column(name = "IS_REPLIED", columnDefinition = "number(1) default 0")
    private boolean isReplied = false;
}
