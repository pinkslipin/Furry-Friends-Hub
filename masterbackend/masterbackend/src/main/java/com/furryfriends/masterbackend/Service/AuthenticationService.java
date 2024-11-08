package com.furryfriends.masterbackend.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.DTO.Login;
import com.furryfriends.masterbackend.DTO.Signup;
import com.furryfriends.masterbackend.Entity.OwnerEntity;
import com.furryfriends.masterbackend.Repository.OwnerRepository;

@Service
public class AuthenticationService {
    @Autowired
    private final OwnerRepository orepo;

    public AuthenticationService(OwnerRepository ownerRepository) {
        this.orepo = ownerRepository;
    }

    public OwnerEntity registerOwner(Signup signupRequest) {
        OwnerEntity owner = new OwnerEntity();
        owner.setFName(signupRequest.getFname());
        owner.setLName(signupRequest.getLname());
        owner.setEmail(signupRequest.getEmail());
        owner.setPhoneNumber(signupRequest.getPhoneNumber());
        owner.setAddress(signupRequest.getAddress());
        owner.setPaymentType(signupRequest.getPaymentType());
        owner.setPassword(signupRequest.getPassword());
        return orepo.save(owner);
    }

    public boolean loginOwner(Login loginRequest) {
        OwnerEntity owner = orepo.findByEmail(loginRequest.getEmail());
        return owner != null && loginRequest.getPassword().equals(owner.getPassword());
    }

}
