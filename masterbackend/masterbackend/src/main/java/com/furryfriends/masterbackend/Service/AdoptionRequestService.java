package com.furryfriends.masterbackend.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.Entity.AdoptionRequestEntity;
import com.furryfriends.masterbackend.Entity.OwnerEntity;
import com.furryfriends.masterbackend.Repository.AdoptionRequestRepository;
import com.furryfriends.masterbackend.Repository.OwnerRepository;

@Service
public class AdoptionRequestService {

    @Autowired
    AdoptionRequestRepository arepo;

    @Autowired
    OwnerRepository orepo;

    public AdoptionRequestEntity createAdoptionRequest(AdoptionRequestEntity request, int ownerId) {
        // Fetch the owner by ID
        OwnerEntity owner = orepo.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found")); // Handle not found

        // Set the owner to the request
        request.setOwner(owner);

        // Save the adoption request
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
