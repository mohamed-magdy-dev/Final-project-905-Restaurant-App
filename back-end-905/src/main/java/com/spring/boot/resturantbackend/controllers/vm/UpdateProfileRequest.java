package com.spring.boot.resturantbackend.controllers.vm;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String phoneNumber;
    private String address;
    private String age;
}