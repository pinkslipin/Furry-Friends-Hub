package com.furryfriends.masterbackend.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.furryfriends.masterbackend.Entity.AppointmentEntity;
import com.furryfriends.masterbackend.Service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Simple print method for testing
    @GetMapping("/print")
    public String print() {
        return "Appointment Controller is working!";
    }

    // Create a new Appointment
    @PostMapping("/postAppointment")
    public ResponseEntity<AppointmentEntity> createAppointment(@RequestBody AppointmentEntity appointment) {
        AppointmentEntity createdAppointment = appointmentService.createAppointment(appointment);
        return createdAppointment != null ? ResponseEntity.status(201).body(createdAppointment) : ResponseEntity.badRequest().build();
    }

    // Retrieve all Appointments
    @GetMapping("/getAllAppointments")
    public ResponseEntity<List<AppointmentEntity>> getAllAppointments() {
        List<AppointmentEntity> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    // Retrieve an Appointment by ID
    @GetMapping("/getAppointment/{appointmentId}")
    public ResponseEntity<AppointmentEntity> getAppointmentById(@PathVariable("appointmentId") int id) {
        Optional<AppointmentEntity> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update an existing Appointment
    @PutMapping("/updateAppointment/{appointmentId}")
    public ResponseEntity<AppointmentEntity> updateAppointment(@PathVariable("appointmentId") int id, @RequestBody AppointmentEntity appointmentDetails) {
        AppointmentEntity updatedAppointment = appointmentService.updateAppointment(id, appointmentDetails);
        return updatedAppointment != null ? ResponseEntity.ok(updatedAppointment) : ResponseEntity.notFound().build();
    }

    // Delete an Appointment
    public ResponseEntity<Void> deleteAppointment(@PathVariable("appointmentId") int id) {
        Optional<AppointmentEntity> appointment = appointmentService.getAppointmentById(id);
        if (appointment.isPresent()) {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}