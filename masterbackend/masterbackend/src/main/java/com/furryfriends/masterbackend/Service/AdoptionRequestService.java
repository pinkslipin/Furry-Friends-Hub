package com.furryfriends.masterbackend.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.DTO.AdoptionRequestDTO;
import com.furryfriends.masterbackend.Entity.AdoptionRequestEntity;
import com.furryfriends.masterbackend.Entity.OwnerEntity;
import com.furryfriends.masterbackend.Entity.PetEntity;
import com.furryfriends.masterbackend.Repository.AdoptionRequestRepository;
import com.furryfriends.masterbackend.Repository.OwnerRepository;
import com.furryfriends.masterbackend.Repository.PetRepository;

@Service
public class AdoptionRequestService {

    @Autowired
    AdoptionRequestRepository arepo;

    @Autowired
    OwnerRepository orepo;

    @Autowired
    PetRepository prepo;

    public AdoptionRequestEntity createAdoptionRequest(AdoptionRequestDTO requestDto) {
        OwnerEntity owner = orepo.findById(requestDto.getOwnerId())
        .orElseThrow(() -> new IllegalArgumentException("Invalid owner ID: " + requestDto.getOwnerId()));

        PetEntity pet = prepo.findById(requestDto.getPid()) // Corrected this line
        .orElseThrow(() -> new IllegalArgumentException("Invalid pet ID: " + requestDto.getPid()));

        // Create the adoption request entity
        AdoptionRequestEntity requestEntity = new AdoptionRequestEntity(
                requestDto.getRequestDate(),
                requestDto.getRequestStatus() != null ? requestDto.getRequestStatus() : "pending",
                owner,
                pet
        );

        // Save and return the entity
        return arepo.save(requestEntity);
    }

    public List<AdoptionRequestEntity> getAllAdoptionRequests() {
        return arepo.findAll();
    }

    public AdoptionRequestEntity updateAdoptionRequest(int requestId, AdoptionRequestEntity newRequestDetails) {
        AdoptionRequestEntity request = arepo.findById(requestId).orElseThrow(() -> new NoSuchElementException("Request not found"));
        request.setRequestDate(newRequestDetails.getRequestDate());
        request.setRequestStatus(newRequestDetails.getRequestStatus());
        request.setOwner(newRequestDetails.getOwner());
        return arepo.save(request);
    }

    public String deleteAdoptionRequest(int requestId) {
        if (arepo.findById(requestId).isPresent()) {
            arepo.deleteById(requestId);
            return "Adoption request deleted successfully";
        } else {
            return "Request ID " + requestId + " not found";
        }
    }

    public List<AdoptionRequestEntity> getRequestsByOwnerId(int ownerId) {
        return arepo.findByOwnerOwnerId(ownerId);
    }

    public void approveRequest(int requestId) {
        AdoptionRequestEntity request = arepo.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found."));
        request.setRequestStatus("approved");
        arepo.save(request);

        // Assign pet to the owner
        PetEntity pet = request.getPet();
        pet.setOwner(request.getOwner());
        prepo.save(pet);
    }

    public void declineRequest(int requestId) {
        AdoptionRequestEntity request = arepo.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found."));
        request.setRequestStatus("declined");
        arepo.save(request);
    }
}
