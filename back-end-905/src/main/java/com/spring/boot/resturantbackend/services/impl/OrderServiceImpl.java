package com.spring.boot.resturantbackend.services.impl;

import com.spring.boot.resturantbackend.config.ProfileIncompleteException;
import com.spring.boot.resturantbackend.controllers.vm.UserOrdersResponse;
import com.spring.boot.resturantbackend.dto.OrderDto;
import com.spring.boot.resturantbackend.dto.ProductDto;
import com.spring.boot.resturantbackend.dto.security.AccountDto;
import com.spring.boot.resturantbackend.mappers.OrderMapper;
import com.spring.boot.resturantbackend.mappers.ProductMapper;
import com.spring.boot.resturantbackend.mappers.security.AccountMapper;
import com.spring.boot.resturantbackend.models.Order;
import com.spring.boot.resturantbackend.models.security.Account;
import com.spring.boot.resturantbackend.repositories.OrderRepo;
import com.spring.boot.resturantbackend.repositories.security.AccountRepo;
import com.spring.boot.resturantbackend.services.OrderService;
import com.spring.boot.resturantbackend.controllers.vm.RequestOrderVm;
import com.spring.boot.resturantbackend.controllers.vm.ResponseOrderVm;
import com.spring.boot.resturantbackend.services.ProductService;
import jakarta.transaction.SystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private ProductService productService;

    @Autowired
    private AccountRepo accountRepo; // added this For checkout

    @Override
    public ResponseOrderVm requestOrder(RequestOrderVm requestOrderVm) {

        AccountDto accountDto = (AccountDto) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Account account = accountRepo.findByUsername(accountDto.getUsername())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getAccountDetails() == null) {
            throw new ProfileIncompleteException();
        }

        List<ProductDto> productDtoList =
                productService.getProductByIds(requestOrderVm.getProductsIds());

        Order order = new Order();
        order.setTotalPrice(requestOrderVm.getTotalPrice());
        order.setTotalNumber(requestOrderVm.getTotalNumber());
        order.setProducts(ProductMapper.PRODUCT_MAPPER.toProductList(productDtoList));
        order.setAccount(account);

        // we put temp so we dont get "null" errors!
        order.setCode("TEMP-CODE"); // TEMP-CODE as a value.

        // we save first, to take the id in.
        Order orderSaved = orderRepo.save(order);

        //  تحديث الكود بالشكل الصحيح (RES-ID)
        String code = "RES-" + orderSaved.getId();
        orderSaved.setCode(code);
        orderRepo.save(orderSaved);
        return new ResponseOrderVm(
                orderSaved.getCode(),
                orderSaved.getTotalPrice(),
                orderSaved.getTotalNumber()
        );
    }
    @Override
    public UserOrdersResponse getOrders() {
        AccountDto accountDto = (AccountDto) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Order> orders =  orderRepo.findByAccountId(accountDto.getId());

        List<OrderDto> orderDtos =  OrderMapper.ORDER_MAPPER.toOrderDtoList(orders);

        double totalPrice = orderDtos.stream()
                .mapToDouble(OrderDto::getTotalPrice)
                .sum();

        return new UserOrdersResponse(
                orderDtos,
                orderDtos.size(),
                totalPrice
        );
    }
    @Override
    public List<OrderDto> getAllOrdersForAdmin() {
        // بنجيب كل الأوردرات ونرتبها بالتاريخ (الأحدث للأقدم)
        // ملاحظة: لو "dateCreated" مش موجود في الـ Entity، غيرها لـ "id" مؤقتاً
        List<Order> orders = orderRepo.findAll(Sort.by(Sort.Direction.DESC, "id"));

        // بنحولها لـ DTO باستخدام المابر بتاعك
        return OrderMapper.ORDER_MAPPER.toOrderDtoList(orders);
    }
}
