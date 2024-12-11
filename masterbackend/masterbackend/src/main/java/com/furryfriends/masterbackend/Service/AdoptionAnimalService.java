package com.furryfriends.masterbackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.furryfriends.masterbackend.Repository.AdoptionAnimalRepository;
import com.furryfriends.masterbackend.Repository.OwnerRepository;
import com.furryfriends.masterbackend.Repository.PetRepository;
import com.furryfriends.masterbackend.Entity.AdoptionAnimalEntity;
import com.furryfriends.masterbackend.Entity.OwnerEntity;
import com.furryfriends.masterbackend.Entity.PetEntity;
import com.furryfriends.masterbackend.DTO.AdoptionAnimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class AdoptionAnimalService {
    
    @Autowired
    private AdoptionAnimalRepository repository;

    @Autowired
    private OwnerRepository orepo;

    @Autowired 
    private PetRepository prepo;

    private AdoptionAnimal convertToDTO(AdoptionAnimalEntity entity) {
        return new AdoptionAnimal(
            entity.getAnimalid(),
            entity.getAnimalname(),
            entity.getSpecies(),
            entity.getBreed(),
            entity.getAge(),
            entity.getStatus(),
            entity.getSex(),
            entity.getWeight(), // No need to handle null here
            entity.getMedRec(),
            entity.getImage()
        );
    }

    private AdoptionAnimalEntity convertToEntity(AdoptionAnimal dto) {
        AdoptionAnimalEntity entity = new AdoptionAnimalEntity(
            dto.getAnimalid(),
            dto.getAnimalname(),
            dto.getSpecies(),
            dto.getBreed(),
            dto.getAge(),
            dto.getStatus(),
            dto.getSex(),
            dto.getWeight(), // Handle null weight
            dto.getMedRec()
        );
        entity.setImage(dto.getImage()); // Include image
        return entity;
    }

    public List<AdoptionAnimal> getAllAnimals() {
        return repository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AdoptionAnimal getAnimalById(int id) {
        return convertToDTO(repository.findByAnimalid(id));  // changed from findByAnimalId
    }

    public AdoptionAnimal createAnimal(AdoptionAnimal animal) {
        try {
            AdoptionAnimalEntity entity = convertToEntity(animal);
            entity.setAnimalid(0); // Ensure it's a new entity
            entity = repository.save(entity);
            return convertToDTO(entity);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create animal: " + e.getMessage());
        }
    }

    public AdoptionAnimal updateAnimal(AdoptionAnimal animal) {
        AdoptionAnimalEntity entity = convertToEntity(animal);
        entity = repository.save(entity);
        return convertToDTO(entity);
    }

    public void deleteAnimal(int id) {
        repository.deleteById(id);
    }

    public List<AdoptionAnimal> getAnimalsByStatus(String status) {
        return repository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AdoptionAnimal> getPendingAdoptions() {
        return repository.findByStatus("Adoption Pending").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void confirmAdoption(int animalId) {
        AdoptionAnimalEntity entity = repository.findByAnimalid(animalId);
        if (entity == null) {
            throw new NoSuchElementException("Animal not found");
        }
        if (!"Adoption Pending".equalsIgnoreCase(entity.getStatus())) {
            throw new IllegalStateException("Animal is not pending adoption");
        }
        OwnerEntity owner = entity.getOwner();
        if (owner == null) {
            throw new IllegalStateException("Owner not found for this adoption");
        }

        // Reflect adoption in pet record
        PetEntity pet = new PetEntity();
        pet.setPetName(entity.getAnimalname());
        pet.setSpecies(entity.getSpecies());
        pet.setBreed(entity.getBreed());
        pet.setWeight(entity.getWeight());
        pet.setAge(entity.getAge());
        pet.setMedRec(entity.getMedRec());
        pet.setOwner(owner);
        pet.setImage(entity.getImage()); // Carry over the image
        pet.setGender(entity.getSex()); // Carry over the gender
        PetEntity savedPet = prepo.save(pet);

        // Add the adopted pet to the owner's pet list
        owner.getPetList().add(savedPet);
        orepo.save(owner);

        // Update the status only after successful association
        entity.setStatus("Adopted");
        repository.save(entity);
    }

    public void rejectAdoption(int animalId) {
        AdoptionAnimalEntity entity = repository.findByAnimalid(animalId);
        entity.setStatus("Available");
        repository.save(entity);
    }
}
