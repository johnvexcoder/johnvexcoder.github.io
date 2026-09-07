package com.example.starbuckslogin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    @GetMapping("/")
    public String showLogin() {
        return "login";
    }

    @PostMapping("/login")
    public String login(
            @RequestParam String username,
            @RequestParam String password,
            Model model
    ) {
        if ("customer@email.com".
                equals(username) && "password123".
                equals(password)) {
            model.addAttribute("username", username);
            return "success";
        }

        model.addAttribute("error", "Invalid username or password. Try customer@email.com / password123.");
        return "login";
    }
}
