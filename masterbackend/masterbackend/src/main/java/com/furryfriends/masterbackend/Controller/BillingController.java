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
import org.springframework.web.bind.annotation.RestController;

import com.furryfriends.masterbackend.Entity.BillingEntity;
import com.furryfriends.masterbackend.Service.BillingService;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "http://localhost:3000")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @GetMapping("/print")
    public String print() {
        return "Billing Controller is working";
    }

    // Get all billing records
    @GetMapping("/getAllBillingRecords")
    public List<BillingEntity> getAllBillingRecords() {
        return billingService.findAllBillingRecords();
    }

    // Create a new billing record
    @PostMapping("/postBillingRecord")
    public ResponseEntity<BillingEntity> createBilling(@RequestBody BillingEntity billing) {
        // Check for null values before saving
        if (billing.getBillingDate() == null || billing.getAmountDue() <= 0 || billing.getAmountPaid() < 0) {
            return ResponseEntity.badRequest().build();
        }

      // Set the billing reference in the appointment if it's provided
        if (billing.getAppointment() != null) {
            billing.getAppointment().setBilling(billing); // Set the reference to the billing entity
        }

        BillingEntity savedBilling = billingService.saveBillingRecord(billing);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBilling);
    }

    // Update an existing billing record by ID
    @PutMapping("/putBillingDetails/{billingId}")
    public ResponseEntity<BillingEntity> updateBilling(@PathVariable int billingId, @RequestBody BillingEntity newBillingDetails) {
        BillingEntity updatedBilling = billingService.updateBillingDetails(billingId, newBillingDetails);
        return ResponseEntity.ok(updatedBilling);
    }

    // Delete a billing record by ID
    @DeleteMapping("/deleteBillingDetails/{billingId}")
    public ResponseEntity<String> deleteBilling(@PathVariable int billingId) {
        String response = billingService.deleteBillingRecord(billingId);
        return ResponseEntity.ok(response);
    }

    // Get billing record by ID
    @GetMapping("/getBillingById/{id}")
    public ResponseEntity<BillingEntity> getBillingById(@PathVariable int id) {
        BillingEntity billing = billingService.findBillingById(id);
        return ResponseEntity.ok(billing);
    }
}