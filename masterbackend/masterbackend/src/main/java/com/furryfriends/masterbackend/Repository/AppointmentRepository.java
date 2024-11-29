package com.furryfriends.masterbackend.Repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.furryfriends.masterbackend.Entity.AppointmentEntity;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Integer> {

    public AppointmentEntity findByAppointmentId(int appointmentId);
    List<AppointmentEntity> findByOwnerOwnerId(int ownerId);
    
}

