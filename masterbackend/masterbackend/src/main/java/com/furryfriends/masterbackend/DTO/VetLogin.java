package com.furryfriends.masterbackend.DTO;

public class VetLogin {
    private String email;
    private String password;

    public VetLogin() {
        super();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
