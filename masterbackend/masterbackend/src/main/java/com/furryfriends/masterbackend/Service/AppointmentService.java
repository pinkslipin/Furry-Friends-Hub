package com.furryfriends.masterbackend.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.DTO.AppointmentRequest;
import com.furryfriends.masterbackend.Entity.AppointmentEntity;
import com.furryfriends.masterbackend.Entity.OwnerEntity;
import com.furryfriends.masterbackend.Entity.PetEntity;
import com.furryfriends.masterbackend.Entity.VetEntity;
import com.furryfriends.masterbackend.Repository.AppointmentRepository;
import com.furryfriends.masterbackend.Repository.OwnerRepository;
import com.furryfriends.masterbackend.Repository.PetRepository;
import com.furryfriends.masterbackend.Repository.VetRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private VetRepository vetRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    // Save Appointment with pet ID and vet ID
    public AppointmentEntity saveAppointmentWithPetId(AppointmentRequest appointmentRequest) {
        AppointmentEntity appointment = new AppointmentEntity();
        appointment.setAppointmentDate(appointmentRequest.getAppointmentDate());
        appointment.setAppointmentTime(appointmentRequest.getAppointmentTime());
        appointment.setStatus(appointmentRequest.getStatus());
        appointment.setDescription(appointmentRequest.getDescription());

        PetEntity pet = petRepository.findById(appointmentRequest.getPetId()).orElseThrow(() -> new RuntimeException("Pet not found"));
        appointment.setPet(pet);

        VetEntity vet = vetRepository.findById(appointmentRequest.getVetId()).orElseThrow(() -> new RuntimeException("Vet not found"));
        appointment.setVet(vet);

        OwnerEntity owner = ownerRepository.findById(appointmentRequest.getOwnerId()).orElseThrow(() -> new RuntimeException("Owner not found"));
        appointment.setOwner(owner);

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
            existingAppointment.setDescription(appointmentRequest.getDescription());

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

    // Delete appointment record by ID
    public String deleteAppointment(int appointmentId) {
        Optional<AppointmentEntity> optionalAppointment = appointmentRepository.findById(appointmentId);
        if (!optionalAppointment.isPresent()) {
            throw new RuntimeException("Appointment record not found with id: " + appointmentId);
        }
        
        AppointmentEntity appointment = optionalAppointment.get();

        // Now delete the AppointmentEntity
        appointmentRepository.delete(appointment);

        return "Appointment record deleted successfully";
    }

    // Find appointment by ID
    public AppointmentEntity findAppointmentById(int appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment record not found with id: " + appointmentId));
    }
    
    // Find appointments by owner ID
    public List<AppointmentEntity> findAppointmentsByOwnerId(int ownerId) {
        return appointmentRepository.findByOwnerOwnerId(ownerId);
    }

    // Confirm appointment by ID
    public String confirmAppointment(int appointmentId) {
        Optional<AppointmentEntity> optionalAppointment = appointmentRepository.findById(appointmentId);
        if (optionalAppointment.isPresent()) {
            AppointmentEntity appointment = optionalAppointment.get();
            appointment.setStatus("approved");
            appointmentRepository.save(appointment);
            return "Appointment confirmed successfully.";
        } else {
            return "Appointment record not found with id: " + appointmentId;
        }
    }

}