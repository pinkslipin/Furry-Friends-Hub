package com.furryfriends.masterbackend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.furryfriends.masterbackend.DTO.AppointmentRequest;
import com.furryfriends.masterbackend.Entity.AppointmentEntity;
import com.furryfriends.masterbackend.Service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Get all appointments
    @GetMapping("/getAllAppointments")
    public List<AppointmentEntity> getAllAppointments() {
        return appointmentService.findAllAppointments();
    }

    // Create a new appointment with pet ID and vet ID
    @PostMapping("/postAppointmentRecord")
    public AppointmentEntity createAppointment(@RequestBody AppointmentRequest appointmentRequest) {
        return appointmentService.saveAppointmentWithPetId(appointmentRequest);
    }

    // Update an existing appointment by ID
    @PutMapping("/putAppointmentDetails/{appointmentId}")
    public AppointmentEntity updateAppointment(@PathVariable int appointmentId, @RequestBody AppointmentEntity newAppointmentDetails) {
        return appointmentService.updateAppointmentDetails(appointmentId, newAppointmentDetails);
    }

    // Delete an appointment by ID
    @DeleteMapping("/deleteAppointmentDetails/{appointmentId}")
    public String deleteAppointment(@PathVariable int appointmentId) {
        return appointmentService.deleteAppointment(appointmentId);
    }

    // Get appointment by ID
    @GetMapping("/getAppointmentById/{appointmentId}")
    public AppointmentEntity getAppointmentById(@PathVariable int appointmentId) {
        return appointmentService.findAppointmentById(appointmentId);
    }
}