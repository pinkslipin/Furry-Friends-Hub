package com.furryfriends.masterbackend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.DTO.BillingDTO;
import com.furryfriends.masterbackend.Entity.BillingEntity;
import com.furryfriends.masterbackend.Repository.BillingRepository;

@Service
public class BillingService {

    @Autowired
    private BillingRepository billingRepository;

    public List<BillingEntity> findAllBillingRecords() {
        return billingRepository.findAll();
    }

    public BillingEntity saveBillingRecord(BillingEntity billing) {
        return billingRepository.save(billing);
    }

    public BillingEntity updateBillingDetails(int billingId, BillingEntity newBillingDetails) {
        BillingEntity existingBilling = billingRepository.findById(billingId)
                .orElseThrow(() -> new RuntimeException("Billing record not found with id: " + billingId));
        existingBilling.setBillingDate(newBillingDetails.getBillingDate());
        existingBilling.setAmountDue(newBillingDetails.getAmountDue());
        existingBilling.setAmountPaid(newBillingDetails.getAmountPaid());
        existingBilling.setOwner(newBillingDetails.getOwner());
        existingBilling.setVet(newBillingDetails.getVet()); // Ensure vet information is set correctly
        return billingRepository.save(existingBilling);
    }

    public String deleteBillingRecord(int billingId) {
        billingRepository.deleteById(billingId);
        return "Billing record deleted successfully";
    }

    public BillingEntity findBillingById(int billingId) {
        return billingRepository.findById(billingId)
                .orElseThrow(() -> new RuntimeException("Billing record not found with id: " + billingId));
    }

    public List<BillingEntity> getBillingRecordsByOwner(int ownerId) {
        return billingRepository.findByOwner_OwnerId(ownerId);
    }
    
    public BillingEntity addPayment(int billingId, double paymentAmount, String paymentType) {
        BillingEntity billing = billingRepository.findById(billingId)
                .orElseThrow(() -> new RuntimeException("Billing record not found with id: " + billingId));
        
        billing.setAmountPaid(billing.getAmountPaid() + paymentAmount);
        billing.setPaymentType(paymentType);
        
        return billingRepository.save(billing);
    }

    public BillingDTO convertToDTO(BillingEntity billingEntity) {
        BillingDTO billingDTO = new BillingDTO();
        billingDTO.setBillingId(billingEntity.getBillingId());
        billingDTO.setBillingDate(billingEntity.getBillingDate());
        billingDTO.setAmountDue(billingEntity.getAmountDue());
        billingDTO.setAmountPaid(billingEntity.getAmountPaid());
        billingDTO.setPaymentType(billingEntity.getPaymentType());

        if (billingEntity.getOwner() != null) {
            billingDTO.setOwnerId(billingEntity.getOwner().getOwnerId());
            billingDTO.setOwnerFname(billingEntity.getOwner().getFName());
            billingDTO.setOwnerLname(billingEntity.getOwner().getLName());
            billingDTO.setOwnerImage(billingEntity.getOwner().getImage() != null ? new String(billingEntity.getOwner().getImage()) : null);
        }

        if (billingEntity.getVet() != null) {
            billingDTO.setVetId(billingEntity.getVet().getVetid());
            billingDTO.setVetName(billingEntity.getVet().getFname() + " " + billingEntity.getVet().getLname());
        } else {
            billingDTO.setVetName("N/A");
        }

        return billingDTO;
    }
}