package com.furryfriends.masterbackend.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.Entity.AdoptionAnimalEntity;
import com.furryfriends.masterbackend.Entity.OwnerEntity;
import com.furryfriends.masterbackend.Entity.PetEntity;
import com.furryfriends.masterbackend.Repository.AdoptionAnimalRepository;
import com.furryfriends.masterbackend.Repository.OwnerRepository;
import com.furryfriends.masterbackend.Repository.PetRepository;

@Service
public class PetService {
    @Autowired
    PetRepository prepo;

    @Autowired
    OwnerRepository orepo;

    @Autowired
    AdoptionAnimalRepository adoptionAnimalRepository;

    public PetService(){
        super();
    }

    public PetEntity postPetRecord(PetEntity pet, int ownerId) {
        // Find the owner by ID
        OwnerEntity owner = orepo.findById(ownerId).orElseThrow(() -> new NoSuchElementException("Owner with ID " + ownerId + " not found!"));
    
        System.out.println("Received pet with imageUrl: " + pet.getImageUrl());
        
        // Set owner for the pet
        pet.setOwner(owner);
        
        // Set default value for medRec if not provided
        if (pet.getMedRec() == null || pet.getMedRec().isEmpty()) {
            pet.setMedRec("N/A");
        }
    
        PetEntity savedPet = prepo.save(pet);
        System.out.println("Saved pet with imageUrl: " + savedPet.getImageUrl());
        return savedPet;
    }

    public List<PetEntity> getAllPets() {
        List<PetEntity> pets = prepo.findAll();
        // Ensure owner information is loaded for each pet
        pets.forEach(pet -> {
            if (pet.getOwner() != null) {
                OwnerEntity owner = orepo.findById(pet.getOwner().getOwnerId())
                    .orElseThrow(() -> new NoSuchElementException("Owner not found"));
                pet.setOwner(owner);
            }
        });
        return pets;
    }

    public PetEntity getPetById(int pid) {
        PetEntity pet = prepo.findById(pid)
            .orElseThrow(() -> new NoSuchElementException("Pet with ID " + pid + " not found!"));
        
        // Ensure owner information is loaded
        if (pet.getOwner() != null) {
            OwnerEntity owner = orepo.findById(pet.getOwner().getOwnerId())
                .orElseThrow(() -> new NoSuchElementException("Owner not found"));
            pet.setOwner(owner);
        }
        return pet;
    }

    public List<PetEntity> getPetsByOwnerId(int ownerId) {
        OwnerEntity owner = orepo.findById(ownerId)
            .orElseThrow(() -> new NoSuchElementException("Owner not found"));
        List<PetEntity> pets = prepo.findByOwnerOwnerId(ownerId);
        // Ensure owner information is loaded for each pet
        pets.forEach(pet -> pet.setOwner(owner));
        return pets;
    }

    public List<PetEntity> findPetsByOwnerId(int ownerId) {
        return prepo.findByOwnerOwnerId(ownerId);
    }

    public PetEntity putPetDetails(int pid, PetEntity newPetDetails) {
        PetEntity pet = prepo.findById(pid)
            .orElseThrow(() -> new NoSuchElementException("Pet with ID " + pid + " not found!"));

        System.out.println("Received imageUrl: " + newPetDetails.getImageUrl());
        System.out.println("Current pet imageUrl: " + pet.getImageUrl());

        // Update the pet details
        pet.setPetName(newPetDetails.getPetName());
        pet.setSpecies(newPetDetails.getSpecies());
        pet.setBreed(newPetDetails.getBreed());
        pet.setWeight(newPetDetails.getWeight());
        pet.setAge(newPetDetails.getAge());
        pet.setMedRec(newPetDetails.getMedRec());
        pet.setImageUrl(newPetDetails.getImageUrl());

        System.out.println("Updated pet imageUrl before save: " + pet.getImageUrl());

        // Save and return the updated pet
        PetEntity savedPet = prepo.save(pet);
        System.out.println("Saved pet imageUrl: " + savedPet.getImageUrl());

        return savedPet;
    }

    public String deletePet(int pid) {
        if (prepo.existsById(pid)) {
            prepo.deleteById(pid);
            return "Pet record with ID " + pid + " successfully deleted";
        } else {
            return "Pet with ID " + pid + " Not Found!";
        }
    }

    public String adoptPet(int ownerId, int animalId) {
        OwnerEntity owner = orepo.findById(ownerId).orElseThrow(() -> new NoSuchElementException("Owner not found"));
        AdoptionAnimalEntity animal = adoptionAnimalRepository.findById(animalId).orElseThrow(() -> new NoSuchElementException("Animal not found"));
        
        if (!animal.getStatus().equalsIgnoreCase("available")) {
            return "Animal is not available for adoption";
        }
        
        animal.setStatus("adopted");
        animal.setOwner(owner);
        adoptionAnimalRepository.save(animal);
        
        // Reflect adoption in pet record
        PetEntity pet = new PetEntity();
        pet.setPetName(animal.getAnimalname());
        pet.setSpecies(animal.getSpecies());
        pet.setBreed(animal.getBreed());
        pet.setWeight(animal.getWeight());
        pet.setAge(animal.getAge());
        pet.setMedRec(animal.getMedRec());
        pet.setOwner(owner);
        pet.setImage(animal.getImage()); // Carry over the image
        PetEntity savedPet = prepo.save(pet);
        
        // Add the adopted pet to the owner's pet list
        owner.getPetList().add(savedPet);
        orepo.save(owner);
        
        
        return "Animal adopted successfully";
    }
}
