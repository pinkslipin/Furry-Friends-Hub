package com.furryfriends.masterbackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.furryfriends.masterbackend.Repository.AdoptionAnimalRepository;
import com.furryfriends.masterbackend.Entity.AdoptionAnimalEntity;
import com.furryfriends.masterbackend.DTO.AdoptionAnimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdoptionAnimalService {
    
    @Autowired
    private AdoptionAnimalRepository repository;

    private AdoptionAnimal convertToDTO(AdoptionAnimalEntity entity) {
        return new AdoptionAnimal(
            entity.getAnimalid(),
            entity.getAnimalname(),
            entity.getSpecies(),
            entity.getBreed(),
            entity.getAge(),
            entity.getStatus(),
            entity.getSex(),
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
            dto.getSex()
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
}
