package com.furryfriends.masterbackend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.furryfriends.masterbackend.DTO.AdoptionRequestDTO;
import com.furryfriends.masterbackend.Entity.AdoptionRequestEntity;
import com.furryfriends.masterbackend.Service.AdoptionRequestService;

@RestController
@RequestMapping("api/furryfriendshubadoption")
@CrossOrigin(origins = "http://localhost:3000")
public class AdoptionRequestController {

    @Autowired
    AdoptionRequestService aserv;

    @PostMapping("/createRequest")
    public AdoptionRequestEntity createRequest(@RequestBody AdoptionRequestDTO requestDto) {
        try {
            // Map DTO to Entity in the service layer
            return aserv.createAdoptionRequest(requestDto);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error creating adoption request: " + e.getMessage());
        }
    }

    @GetMapping("/getAllRequests")
    public List<AdoptionRequestEntity> getAllRequests() {
        return aserv.getAllAdoptionRequests();
    }

    @PutMapping("/updateRequest/{requestId}")
    public AdoptionRequestEntity updateRequest(@PathVariable int requestId, @RequestBody AdoptionRequestEntity newRequestDetails) {
        return aserv.updateAdoptionRequest(requestId, newRequestDetails);
    }

    @DeleteMapping("/deleteRequest/{requestId}")
    public String deleteRequest(@PathVariable int requestId) {
        return aserv.deleteAdoptionRequest(requestId);
    }

    @GetMapping("/getRequestsByOwner")
    public List<AdoptionRequestEntity> getRequestsByOwner(@RequestParam int ownerId) {
        return aserv.getRequestsByOwnerId(ownerId);
    }

    @PutMapping("/approveRequest/{requestId}")
    public ResponseEntity<?> approveRequest(@PathVariable int requestId) {
        try {
            aserv.approveRequest(requestId);
            return ResponseEntity.ok("Adoption request approved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error approving request: " + e.getMessage());
        }
    }

    @PutMapping("/declineRequest/{requestId}")
    public ResponseEntity<?> declineRequest(@PathVariable int requestId) {
        try {
            aserv.declineRequest(requestId);
            return ResponseEntity.ok("Adoption request declined successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error declining request: " + e.getMessage());
        }
    }
}
