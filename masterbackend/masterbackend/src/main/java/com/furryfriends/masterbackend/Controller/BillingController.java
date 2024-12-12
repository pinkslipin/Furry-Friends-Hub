package com.furryfriends.masterbackend.Controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.RestController;

import com.furryfriends.masterbackend.DTO.BillingDTO;
import com.furryfriends.masterbackend.Entity.BillingEntity;
import com.furryfriends.masterbackend.Entity.OwnerEntity;
import com.furryfriends.masterbackend.Entity.VetEntity;
import com.furryfriends.masterbackend.Repository.OwnerRepository;
import com.furryfriends.masterbackend.Repository.VetRepository;
import com.furryfriends.masterbackend.Service.BillingService;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "http://localhost:3000")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private VetRepository vetRepository;

    @GetMapping("/print")
    public String print() {
        return "Billing Controller is working";
    }

    // Get all billing records
    @GetMapping("/getAllBillingRecords")
    public ResponseEntity<List<BillingDTO>> getAllBillingRecords() {
        List<BillingEntity> billingRecords = billingService.findAllBillingRecords();
        List<BillingDTO> billingDTOs = billingRecords.stream().map(billingService::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(billingDTOs);
    }

    // Create a new billing record
    @PostMapping("/postBillingRecord")
    public ResponseEntity<BillingDTO> createBilling(@RequestBody BillingDTO billingDTO) {
        BillingEntity billing = new BillingEntity();
        billing.setBillingDate(billingDTO.getBillingDate());
        billing.setAmountDue(billingDTO.getAmountDue());
        billing.setAmountPaid(billingDTO.getAmountPaid());
        billing.setPaymentType(billingDTO.getPaymentType());

        // Set the owner if provided
        if (billingDTO.getOwnerId() > 0) {
            OwnerEntity owner = ownerRepository.findById(billingDTO.getOwnerId())
                    .orElseThrow(() -> new RuntimeException("Owner not found with id: " + billingDTO.getOwnerId()));
            billing.setOwner(owner);
        }

        // Set the vet if provided
        if (billingDTO.getVetId() > 0) {
            VetEntity vet = vetRepository.findById(billingDTO.getVetId())
                    .orElseThrow(() -> new RuntimeException("Vet not found with id: " + billingDTO.getVetId()));
            billing.setVet(vet);
        }

        BillingEntity savedBilling = billingService.saveBillingRecord(billing);
        BillingDTO savedBillingDTO = billingService.convertToDTO(savedBilling);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBillingDTO);
    }

    @PutMapping("/putBillingDetails/{billingId}")
    public ResponseEntity<BillingDTO> updateBilling(@PathVariable int billingId, @RequestBody BillingDTO billingDTO) {
        BillingEntity newBillingDetails = new BillingEntity();
        newBillingDetails.setBillingDate(billingDTO.getBillingDate());
        newBillingDetails.setAmountDue(billingDTO.getAmountDue());
        newBillingDetails.setAmountPaid(billingDTO.getAmountPaid());
        newBillingDetails.setPaymentType(billingDTO.getPaymentType());

        // Set the owner if provided
        if (billingDTO.getOwnerId() > 0) {
            OwnerEntity owner = ownerRepository.findById(billingDTO.getOwnerId())
                    .orElseThrow(() -> new RuntimeException("Owner not found with id: " + billingDTO.getOwnerId()));
            newBillingDetails.setOwner(owner);
        }

        // Set the vet if provided
        if (billingDTO.getVetId() > 0) {
            VetEntity vet = vetRepository.findById(billingDTO.getVetId())
                    .orElseThrow(() -> new RuntimeException("Vet not found with id: " + billingDTO.getVetId()));
            newBillingDetails.setVet(vet);
        }

        BillingEntity updatedBilling = billingService.updateBillingDetails(billingId, newBillingDetails);
        BillingDTO updatedBillingDTO = billingService.convertToDTO(updatedBilling);
        return new ResponseEntity<>(updatedBillingDTO, HttpStatus.OK);
    }

    // Delete a billing record by ID
    @DeleteMapping("/deleteBillingDetails/{billingId}")
    public ResponseEntity<String> deleteBilling(@PathVariable int billingId) {
        String response = billingService.deleteBillingRecord(billingId);
        return ResponseEntity.ok(response);
    }

    // Get billing record by ID
    @GetMapping("/getBillingById/{id}")
    public ResponseEntity<BillingDTO> getBillingById(@PathVariable int id) {
        BillingEntity billing = billingService.findBillingById(id);
        BillingDTO billingDTO = billingService.convertToDTO(billing);
        return ResponseEntity.ok(billingDTO);
    }

    // Get billing records by owner ID
    @GetMapping("/getBillingRecordsByOwner/{ownerId}")
    public ResponseEntity<List<BillingDTO>> getBillingRecordsByOwner(@PathVariable int ownerId) {
        List<BillingEntity> billingRecords = billingService.getBillingRecordsByOwner(ownerId);
        List<BillingDTO> billingDTOs = billingRecords.stream()
                .map(billingService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(billingDTOs);
    }

    // Add payment to billing record
    @PutMapping("/addPayment/{billingId}")
    public ResponseEntity<BillingEntity> addPayment(@PathVariable int billingId, @RequestBody Map<String, Object> request) {
        if (!request.containsKey("paymentAmount") || !request.containsKey("paymentType")) {
            return ResponseEntity.badRequest().build();
        }

        double paymentAmount = Double.parseDouble(request.get("paymentAmount").toString());
        String paymentType = request.get("paymentType").toString();

        BillingEntity updatedBilling = billingService.addPayment(billingId, paymentAmount, paymentType);
        return ResponseEntity.ok(updatedBilling);
    }
}