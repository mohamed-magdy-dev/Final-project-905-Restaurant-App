package com.spring.boot.resturantbackend.repositories.security;

import com.spring.boot.resturantbackend.models.security.AccountDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountDetailsRepo extends JpaRepository<AccountDetails, Long> {
    AccountDetails findByAccount_Id(Long accountId);
}
