package com.furryfriends.masterbackend.Repository;

import com.furryfriends.masterbackend.Entity.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<PetEntity, Integer> {
    public PetEntity findBypetName(String petName);
    List<PetEntity> findByOwnerOwnerId(int ownerId);
}
