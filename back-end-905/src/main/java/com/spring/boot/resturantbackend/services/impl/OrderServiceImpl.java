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

        // 1️⃣ نجيب اليوزر اللي عامل Login
        AccountDto accountDto = (AccountDto) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        // 2️⃣ نجيب الـ Account من الداتا بيز
        Account account = accountRepo.findByUsername(accountDto.getUsername())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // 3️⃣ CHECK المهم 🔴
        if (account.getAccountDetails() == null) {
            throw new ProfileIncompleteException();
        }

        // 4️⃣ باقي الكود زي ما هو
        List<ProductDto> productDtoList =
                productService.getProductByIds(requestOrderVm.getProductsIds());

        Order order = new Order();
        order.setTotalPrice(requestOrderVm.getTotalPrice());
        order.setTotalNumber(requestOrderVm.getTotalNumber());
        order.setProducts(ProductMapper.PRODUCT_MAPPER.toProductList(productDtoList));
        order.setAccount(account);

        // 🔥 التعديل هنا: نحط قيمة مؤقتة عشان نتفادى خطأ الـ NULL
        order.setCode("TEMP-CODE");

        // 4. الحفظ الأول (عشان ناخد ID)
        Order orderSaved = orderRepo.save(order);

        // 5. تحديث الكود بالشكل الصحيح (RES-ID)
        String code = "RES-" + orderSaved.getId();
        orderSaved.setCode(code);

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
