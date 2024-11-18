package com.furryfriends.masterbackend.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.furryfriends.masterbackend.DTO.PetRecordRequest;
import com.furryfriends.masterbackend.DTO.PetResponseDTO;
import com.furryfriends.masterbackend.Entity.PetEntity;
import com.furryfriends.masterbackend.Service.PetService;

@RestController
@RequestMapping("/api/pet")
@CrossOrigin(origins = "http://localhost:3000")
public class PetController {
    @Autowired
    PetService pserv;

    private PetResponseDTO convertToDTO(PetEntity pet) {
        PetResponseDTO dto = new PetResponseDTO();
        dto.setPid(pet.getPid());
        dto.setPetName(pet.getPetName());
        dto.setSpecies(pet.getSpecies());
        dto.setBreed(pet.getBreed());
        dto.setWeight(pet.getWeight());
        dto.setAge(pet.getAge());
        dto.setMedRec(pet.getMedRec());
        
        if (pet.getOwner() != null) {
            dto.setOwner(new PetResponseDTO.OwnerDTO(
                pet.getOwner().getOwnerId(),
                pet.getOwner().getFName(),
                pet.getOwner().getLName()
            ));
        }
        
        return dto;
    }

    @PostMapping("/postPetRecord")
    public ResponseEntity<PetResponseDTO> postPetRecord(@RequestBody PetRecordRequest petRequest) {
        PetEntity pet = new PetEntity();
        pet.setPetName(petRequest.getPetName());
        pet.setSpecies(petRequest.getSpecies());
        pet.setBreed(petRequest.getBreed());
        pet.setWeight(petRequest.getWeight());
        pet.setAge(petRequest.getAge());
        pet.setMedRec(petRequest.getMedRec());

        PetEntity savedPet = pserv.postPetRecord(pet, petRequest.getOwnerId());
        return ResponseEntity.ok(convertToDTO(savedPet));
    }

    @GetMapping("/getAllPets")
    public List<PetResponseDTO> getAllPets() {
        return pserv.getAllPets().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<PetResponseDTO>> getPetsByOwnerId(@PathVariable int ownerId) {
        List<PetResponseDTO> pets = pserv.getPetsByOwnerId(ownerId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(pets);
    }
    
    @GetMapping("/{pid}")
    public ResponseEntity<PetResponseDTO> getPetById(@PathVariable int pid) {
        return ResponseEntity.ok(convertToDTO(pserv.getPetById(pid)));
    }

    @PutMapping(value = "/putPetDetails/{pid}", produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> putPetDetails(@PathVariable int pid, @RequestBody PetEntity newPetDetails) {
        try {
            if (newPetDetails.getPetName() == null || newPetDetails.getPetName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Pet name is required");
            }

            newPetDetails.setPid(pid);
            PetEntity updatedPet = pserv.putPetDetails(pid, newPetDetails);
            return ResponseEntity.ok(convertToDTO(updatedPet));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error updating pet: " + e.getMessage());
        }
    }

    @DeleteMapping("/deletePet/{pid}")
    public String deletePet(@PathVariable int pid) {
        return pserv.deletePet(pid);
    }
}
