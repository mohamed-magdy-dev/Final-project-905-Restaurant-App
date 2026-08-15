package com.spring.boot.resturantbackend.services.impl.security;

import com.spring.boot.resturantbackend.config.security.TokenHandler;
import com.spring.boot.resturantbackend.controllers.vm.Security.AccountAuthRequestVm;
import com.spring.boot.resturantbackend.controllers.vm.Security.LoginRequestVm;
import com.spring.boot.resturantbackend.dto.security.AccountDto;
import com.spring.boot.resturantbackend.mappers.security.AccountMapper;
import com.spring.boot.resturantbackend.services.security.AccountService;
import com.spring.boot.resturantbackend.services.security.AuthService;
import com.spring.boot.resturantbackend.controllers.vm.Security.SignupRequestVm;
import com.spring.boot.resturantbackend.controllers.vm.Security.AccountAuthResponseVm;
import jakarta.transaction.SystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private AccountService accountService;
    @Autowired
    private TokenHandler tokenHandler;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AccountAuthResponseVm signUp(SignupRequestVm vm) {

        AccountDto accountDto = new AccountDto();
        accountDto.setUsername(vm.getUsername());
        accountDto.setPassword(vm.getPassword());
        accountDto.setEmail(vm.getEmail());
        accountDto.setEnabled("Y");
        accountDto = accountService.createAccount(accountDto);
        AccountAuthResponseVm response = AccountMapper.ACCOUNT_MAPPER.toAccountResponseVm(accountDto);
        response.setToken(tokenHandler.generateToken(accountDto));
        response.setUserRoles(getAccountRoles(accountDto));

        return response;
    }


    @Override
    public AccountAuthResponseVm login(LoginRequestVm vm) {

        AccountDto accountDto =
                accountService.getAccountByUsername(vm.getUsername());

        if (accountDto == null) {
            throw new RuntimeException("not_found.account");
        }

        if (!passwordEncoder.matches(vm.getPassword(), accountDto.getPassword())) {
            throw new RuntimeException("error.invalid.credentials");
        }

        AccountAuthResponseVm response =
                AccountMapper.ACCOUNT_MAPPER.toAccountResponseVm(accountDto);

        response.setToken(tokenHandler.generateToken(accountDto));
        response.setUserRoles(getAccountRoles(accountDto));

        return response;
    }


    private List<String> getAccountRoles(AccountDto accountDto) {
        return accountDto.getRoles().stream().map(roleDto -> roleDto.getRole()).collect(Collectors.toList());
    }
}
