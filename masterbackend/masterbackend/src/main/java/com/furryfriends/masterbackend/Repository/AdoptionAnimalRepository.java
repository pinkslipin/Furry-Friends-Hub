package com.furryfriends.masterbackend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.furryfriends.masterbackend.Entity.AdoptionAnimalEntity;

import java.util.List;

@Repository
public interface AdoptionAnimalRepository extends JpaRepository<AdoptionAnimalEntity, Integer> {
    AdoptionAnimalEntity findByAnimalid(int animalid);  // Ensure correct method names
    AdoptionAnimalEntity findByAnimalname(String animalname);  // changed from findByAnimalName
    AdoptionAnimalEntity findBySpecies(String species);  // changed from findByAnimalSpecies
    AdoptionAnimalEntity findByBreed(String breed);  // changed from findByAnimalBreed
    AdoptionAnimalEntity findByAge(int age);  // changed from findByAnimalAge
    AdoptionAnimalEntity findByWeight(Double weight);  // changed from findByAnimalWeight
    AdoptionAnimalEntity findByMedRec(String medRec);  // changed from findByAnimalMedRec
    List<AdoptionAnimalEntity> findByStatus(String status);
}
