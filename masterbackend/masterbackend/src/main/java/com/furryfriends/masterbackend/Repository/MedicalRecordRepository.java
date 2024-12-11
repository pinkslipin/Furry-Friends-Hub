package com.furryfriends.masterbackend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.furryfriends.masterbackend.Entity.MedicalRecordEntity;
import com.furryfriends.masterbackend.Entity.PetEntity;
import com.furryfriends.masterbackend.Entity.VetEntity;

@Repository

public interface MedicalRecordRepository extends JpaRepository<MedicalRecordEntity, Integer>{

//this is user-defined method to search a student record by lastname

//public MedicalRecordEntity findByLname(String lname);

//you may define more methods for searching, for instance, in this interface
    //public List<MedicalRecordEntity> findByP
    List<MedicalRecordEntity> findAllByVet(VetEntity vet);
    List<MedicalRecordEntity> findAllByPet(PetEntity pet);
    List<MedicalRecordEntity> findAllByPetIn(List<PetEntity> pets);
}
