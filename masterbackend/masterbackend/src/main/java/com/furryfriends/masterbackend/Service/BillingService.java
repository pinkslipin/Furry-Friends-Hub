package com.furryfriends.masterbackend.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.Entity.AppointmentEntity;
import com.furryfriends.masterbackend.Entity.BillingEntity;
import com.furryfriends.masterbackend.Repository.AppointmentRepository;
import com.furryfriends.masterbackend.Repository.BillingRepository;

@Service
public class BillingService {

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public BillingEntity saveBillingRecord(BillingEntity billing) {
        // Save the billing record first
        BillingEntity savedBilling = billingRepository.save(billing);
        // Return the saved billing entity with the generated ID
        return savedBilling;
    }

    // Retrieve all billing records
    public List<BillingEntity> findAllBillingRecords() {
        return billingRepository.findAll();
    }

    // Update billing details
    public BillingEntity updateBillingDetails(int billingId, BillingEntity newBillingDetails) {
        Optional<BillingEntity> optionalBilling = billingRepository.findById(billingId);
        if (optionalBilling.isPresent()) {
            BillingEntity existingBilling = optionalBilling.get();
            existingBilling.setBillingDate(newBillingDetails.getBillingDate());
            existingBilling.setAmountDue(newBillingDetails.getAmountDue());
            existingBilling.setAmountPaid(newBillingDetails.getAmountPaid());

            AppointmentEntity newAppointment = newBillingDetails.getAppointment();
            if (newAppointment != null) {
                newAppointment = appointmentRepository.save(newAppointment);
                existingBilling.setAppointment(newAppointment);
            }

            return billingRepository.save(existingBilling);
        } else {
            throw new RuntimeException("Billing record not found with id: " + billingId);
        }
    }

    // Delete billing record by ID
    public String deleteBillingRecord(int billingId) {
        if (!billingRepository.existsById(billingId)) {
            throw new RuntimeException("Billing record not found with id: " + billingId);
        }
        billingRepository.deleteById(billingId);
        return "Billing record deleted successfully";
    }

    // Find billing record by ID
    public BillingEntity findBillingById(int billingId) {
        return billingRepository.findById(billingId)
                .orElseThrow(() -> new RuntimeException("Billing record not found with id: " + billingId));
    }
}