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

    // Update appointment details
    public AppointmentEntity updateAppointmentDetails(int appointmentId, AppointmentEntity newAppointmentDetails) {
        Optional<AppointmentEntity> optionalAppointment = appointmentRepository.findById(appointmentId);
        if (optionalAppointment.isPresent()) {
            AppointmentEntity existingAppointment = optionalAppointment.get();
            // Update appointment fields
            existingAppointment.setAppointmentDate(newAppointmentDetails.getAppointmentDate());
            existingAppointment.setAppointmentTime(newAppointmentDetails.getAppointmentTime());
            existingAppointment.setStatus(newAppointmentDetails.getStatus());

            BillingEntity newBillingDetails = newAppointmentDetails.getBilling();
            if (newBillingDetails != null) {
                existingAppointment.setBilling(newBillingDetails);
            }
            return appointmentRepository.save(existingAppointment);
        } else {
            throw new RuntimeException("Appointment record not found with id: " + appointmentId);
        }
    }

    // Delete appointment record by ID
    public String deleteAppointment(int appointmentId) {
        if (!appointmentRepository.existsById(appointmentId)) {
            throw new RuntimeException("Appointment record not found with id: " + appointmentId);
        }
        appointmentRepository.deleteById(appointmentId);
        return "Appointment record deleted successfully";
    }

    // Find appointment by ID
    public AppointmentEntity findAppointmentById(int appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment record not found with id: " + appointmentId));
    }
}