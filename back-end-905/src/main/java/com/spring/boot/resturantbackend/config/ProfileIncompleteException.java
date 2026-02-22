package com.spring.boot.resturantbackend.config;

public class ProfileIncompleteException extends RuntimeException {
    public ProfileIncompleteException() {
        super("PROFILE_INCOMPLETE");
    }
}