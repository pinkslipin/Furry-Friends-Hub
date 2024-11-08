package com.furryfriends.masterbackend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.furryfriends.masterbackend.Entity.OwnerEntity;
    
@Repository
public interface OwnerRepository extends JpaRepository<OwnerEntity, Integer> {
	public List<OwnerEntity> findByLname(String lname);
    public OwnerEntity findByOwnerId(Integer id);
    public OwnerEntity findByEmail(String email);
}
