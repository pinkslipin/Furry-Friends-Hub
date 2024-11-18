package com.furryfriends.masterbackend.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.DTO.AppointmentRequest;
import com.furryfriends.masterbackend.Entity.AppointmentEntity;
import com.furryfriends.masterbackend.Entity.BillingEntity;
import com.furryfriends.masterbackend.Entity.PetEntity;
import com.furryfriends.masterbackend.Entity.VetEntity;
import com.furryfriends.masterbackend.Repository.AppointmentRepository;
import com.furryfriends.masterbackend.Repository.BillingRepository;
import com.furryfriends.masterbackend.Repository.PetRepository;
import com.furryfriends.masterbackend.Repository.VetRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private VetRepository vetRepository;

    // Save Appointment with pet ID and vet ID
    public AppointmentEntity saveAppointmentWithPetId(AppointmentRequest appointmentRequest) {
        PetEntity pet = petRepository.findById(appointmentRequest.getPetId()).orElseThrow(() -> new RuntimeException("Pet not found"));
        VetEntity vet = vetRepository.findById(appointmentRequest.getVetId()).orElseThrow(() -> new RuntimeException("Vet not found"));

        AppointmentEntity appointment = new AppointmentEntity();
        appointment.setAppointmentDate(appointmentRequest.getAppointmentDate());
        appointment.setAppointmentTime(appointmentRequest.getAppointmentTime());
        appointment.setStatus(appointmentRequest.getStatus());
        appointment.setPet(pet);
        appointment.setVet(vet);

        BillingEntity billing = new BillingEntity();
        billing.setBillingDate(appointmentRequest.getBillingDate());
        billing.setAmountDue(appointmentRequest.getAmountDue());
        billing.setAmountPaid(appointmentRequest.getAmountPaid());
        billingRepository.save(billing);

        appointment.setBilling(billing);

        return appointmentRepository.save(appointment);
    }

    // Retrieve all appointments
    public List<AppointmentEntity> findAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Update appointment details by ID
    public String updateAppointmentDetails(int appointmentId, AppointmentRequest appointmentRequest) {
        Optional<AppointmentEntity> optionalAppointment = appointmentRepository.findById(appointmentId);
        String msg = "";

        if (optionalAppointment.isPresent()) {
            AppointmentEntity existingAppointment = optionalAppointment.get();

            // Update appointment fields
            existingAppointment.setAppointmentDate(appointmentRequest.getAppointmentDate());
            existingAppointment.setAppointmentTime(appointmentRequest.getAppointmentTime());
            existingAppointment.setStatus(appointmentRequest.getStatus());

            // Update vet details
            VetEntity vet = vetRepository.findById(appointmentRequest.getVetId()).orElse(null);
            if (vet == null) {
                msg += "Vet not found with id: " + appointmentRequest.getVetId() + "\n";
            } else {
                existingAppointment.setVet(vet);
            }

            // Update pet details
            PetEntity pet = petRepository.findById(appointmentRequest.getPetId()).orElse(null);
            if (pet == null) {
                msg += "Pet not found with id: " + appointmentRequest.getPetId() + "\n";
            } else {
                existingAppointment.setPet(pet);
            }

            appointmentRepository.save(existingAppointment);
            msg += "Appointment updated successfully.";
        } else {
            msg = "Appointment record not found with id: " + appointmentId;
        }

        return msg;
    }

    // Delete appointment record by ID, excluding VetEntity
    public String deleteAppointment(int appointmentId) {
        Optional<AppointmentEntity> optionalAppointment = appointmentRepository.findById(appointmentId);
        if (!optionalAppointment.isPresent()) {
            throw new RuntimeException("Appointment record not found with id: " + appointmentId);
        }
        
        AppointmentEntity appointment = optionalAppointment.get();

        // Remove the reference to the BillingEntity in the Appointment
        BillingEntity billing = appointment.getBilling();
        if (billing != null) {
            // Unlink the billing from the appointment before deletion
            appointment.setBilling(null); // Remove the reference to BillingEntity
            billingRepository.delete(billing); // Only delete the BillingEntity
        }

        // Now delete the AppointmentEntity
        appointmentRepository.delete(appointment);

        return "Appointment record deleted successfully, excluding VetEntity";
    }

    // Find appointment by ID
    public AppointmentEntity findAppointmentById(int appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment record not found with id: " + appointmentId));
    }
}