package com.furryfriends.masterbackend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.furryfriends.masterbackend.Entity.PetEntity;

@Repository
public interface PetRepository extends JpaRepository<PetEntity, Integer> {
    public PetEntity findBypetName(String petName);
    List<PetEntity> findByOwnerOwnerId(int ownerId);
    List<PetEntity> findByOwnerIsNull();
}
