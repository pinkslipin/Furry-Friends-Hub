package com.furryfriends.masterbackend.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    private VetRepository vetRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private BillingRepository billingRepository;

    // Create
    public AppointmentEntity createAppointment(AppointmentEntity appointment) {
        if (appointment.getVets() != null && appointment.getVets().getVetid() != 0) {
            VetEntity vet = vetRepository.findById(appointment.getVets().getVetid()).orElse(null);
            if (vet != null) {
                appointment.setVets(vet);
            }
        }

        if (appointment.getPet() != null && appointment.getPet().getPid() != 0) {
            PetEntity pet = petRepository.findById(appointment.getPet().getPid()).orElse(null);
            if (pet != null) {
                appointment.setPet(pet);
            }
        }
        if (appointment.getBilling() != null && appointment.getBilling().getBillingId() != 0) {
            BillingEntity billing = billingRepository.findById(appointment.getBilling().getBillingId()).orElse(null);
            if (billing != null) {
                appointment.setBilling(billing);
            }
        }
        return appointmentRepository.save(appointment);
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
    
            if (appointmentDetails.getVets() != null) {
                VetEntity vet = vetRepository.findById(appointmentDetails.getVets().getVetid()).orElse(null);
                if (vet != null) {
                    appointment.setVets(vet);
                }
            }
    
            if (appointmentDetails.getPet() != null) {
                PetEntity pet = petRepository.findById(appointmentDetails.getPet().getPid()).orElse(null);
                if (pet != null) {
                    appointment.setPet(pet);
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
