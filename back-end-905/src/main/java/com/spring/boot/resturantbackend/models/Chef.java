package com.spring.boot.resturantbackend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="CHEF",schema = "hr")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Chef {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="NAME",nullable = false)
    private String name;
    @Column(name="SPECIALTY",nullable = false)
    private String spec;
    @Column(name="LOGO_PATH",nullable = false)
    private String logoPath;
    @Column(name="FACEBOOK_LINK",nullable = false)
    private String faceLink;
    @Column(name="TWITTER_LINK",nullable = false)
    private String tweLink;
    @Column(name="INSTAGRAM_LINK",nullable = false)
    private String instaLink;
}
