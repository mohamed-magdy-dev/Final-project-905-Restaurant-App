package com.spring.boot.resturantbackend.services.security;

import com.spring.boot.resturantbackend.controllers.vm.Security.AccountAuthRequestVm;
import com.spring.boot.resturantbackend.controllers.vm.Security.AccountAuthResponseVm;
import com.spring.boot.resturantbackend.controllers.vm.Security.LoginRequestVm;
import com.spring.boot.resturantbackend.controllers.vm.Security.SignupRequestVm;

public interface AuthService {

    AccountAuthResponseVm signUp(SignupRequestVm vm);

    AccountAuthResponseVm login(LoginRequestVm vm);
    //    AccountAuthResponseVm signUp(AccountAuthRequestVm accountAuthRequestVm);
//
//    AccountAuthResponseVm login(AccountAuthRequestVm accountAuthRequestVm);
}
