package com.furryfriends.masterbackend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.furryfriends.masterbackend.Entity.AdoptionAnimalEntity;

@Repository
public interface AdoptionAnimalRepository extends JpaRepository<AdoptionAnimalEntity, Integer> {
    AdoptionAnimalEntity findByAnimalid(int animalid);  // changed from findByAnimalId
    AdoptionAnimalEntity findByAnimalname(String animalname);  // changed from findByAnimalName
    AdoptionAnimalEntity findBySpecies(String species);  // changed from findByAnimalSpecies
    AdoptionAnimalEntity findByBreed(String breed);  // changed from findByAnimalBreed
    AdoptionAnimalEntity findByAge(int age);  // changed from findByAnimalAge
}
