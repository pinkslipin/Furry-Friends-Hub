package com.furryfriends.masterbackend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.furryfriends.masterbackend.Entity.VetEntity;

@Repository 
public interface VetRepository extends JpaRepository<VetEntity, Integer>{

    public VetEntity findByLname(String lname);
    public VetEntity findByEmail(String email);

}
