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

    public AdoptionRequestEntity createAdoptionRequest(AdoptionRequestDTO requestDTO) {
        OwnerEntity owner = orepo.findById(requestDTO.getOwnerId()).orElseThrow(() -> 
        new NoSuchElementException("Owner with ID " + requestDTO.getOwnerId() + " not found")
    );

    PetEntity pet = prepo.findById(requestDTO.getPetId()).orElseThrow(() -> 
        new NoSuchElementException("Pet with ID " + requestDTO.getPetId() + " not found")
    );

    AdoptionRequestEntity request = new AdoptionRequestEntity();
    request.setRequestDate(requestDTO.getRequestDate());
    request.setRequestStatus("pending");
    request.setOwner(owner);
    request.setPet(pet);

    return arepo.save(request);
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
}
