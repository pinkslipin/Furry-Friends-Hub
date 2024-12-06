package com.furryfriends.masterbackend.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.Entity.OwnerEntity;
import com.furryfriends.masterbackend.Repository.OwnerRepository;
import com.furryfriends.masterbackend.Entity.AdoptionAnimalEntity;
import com.furryfriends.masterbackend.Repository.AdoptionAnimalRepository;

@Service
public class OwnerService {
    @Autowired
    OwnerRepository orepo;

    @Autowired
    AdoptionAnimalRepository adoptionAnimalRepository;

    public OwnerService() { 
        super();
    }

    public OwnerEntity postOwnerAccounts(OwnerEntity owner) {
        if (owner.getRole() == null) {
            owner.setRole("OWNER");
        }
        return orepo.save(owner);
    }

    public List<OwnerEntity> getAllOwners() {
        return orepo.findAll();
    }

    public OwnerEntity updateProfile(int id, OwnerEntity updatedProfile) {
        OwnerEntity owner = orepo.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));
        owner.setFName(updatedProfile.getFName());
        owner.setLName(updatedProfile.getLName());
        owner.setEmail(updatedProfile.getEmail());
        owner.setPhoneNumber(updatedProfile.getPhoneNumber());
        owner.setAddress(updatedProfile.getAddress());
        owner.setPaymentType(updatedProfile.getPaymentType());
        owner.setPassword(updatedProfile.getPassword());
    
        return orepo.save(owner);
    }

    public String deleteOwner(int id) {
        Optional<OwnerEntity> ownerOptional = orepo.findById(id);
        if (ownerOptional.isPresent()) {
            OwnerEntity owner = ownerOptional.get();
            owner.getAdoptionRequests().clear();
            orepo.save(owner); 
            orepo.delete(owner); 
            return "User record successfully deleted";
        } else {
            return id + " Not Found";
        }
    }
    
    public OwnerEntity findByEmail(String email) {
        return orepo.findByEmail(email); 
    }

    public OwnerEntity findById(int ownerId) {
        return orepo.findById(ownerId).orElse(null);
    }

    public OwnerEntity save(OwnerEntity owner) {
        return orepo.save(owner);
    }

}
