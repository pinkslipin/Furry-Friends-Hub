package com.furryfriends.masterbackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.Entity.AppointmentEntity;
import com.furryfriends.masterbackend.Entity.VetEntity;
import com.furryfriends.masterbackend.Repository.AppointmentRepository;
import com.furryfriends.masterbackend.Repository.VetRepository;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private VetRepository vetRepository;

    // Create
    public AppointmentEntity createAppointment(AppointmentEntity appointment) {
        // Check if the vetId is provided
        if (appointment.getVets() != null && appointment.getVets().getVetid() != 0) {
            VetEntity vet = vetRepository.findById(appointment.getVets().getVetid()).orElse(null);
            if (vet != null) {
                appointment.setVets(vet);
                return appointmentRepository.save(appointment);
            }
        }
        return null; // or throw an exception
    }

    // Read
    public List<AppointmentEntity> getAllAppointments() {
        // This fetches all appointments along with their associated vets
        return appointmentRepository.findAll();
    }

    public Optional<AppointmentEntity> getAppointmentById(int appointmentId) {
        return appointmentRepository.findById(appointmentId);
    }

    // Update
    public AppointmentEntity updateAppointment(int appointmentId, AppointmentEntity appointmentDetails) {
        AppointmentEntity appointment = appointmentRepository.findByAppointmentId(appointmentId);
        if (appointment != null) {
            appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
            appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
            appointment.setStatus(appointmentDetails.getStatus());

            // Update vet if provided
            if (appointmentDetails.getVets() != null) {
                VetEntity vet = vetRepository.findById(appointmentDetails.getVets().getVetid()).orElse(null);
                if (vet != null) {
                    appointment.setVets(vet);
                }
            }
            return appointmentRepository.save(appointment);
        }
        return null;
    }

    // Delete
    public void deleteAppointment(int appointmentId) {
        appointmentRepository.deleteById(appointmentId);
    }
}
