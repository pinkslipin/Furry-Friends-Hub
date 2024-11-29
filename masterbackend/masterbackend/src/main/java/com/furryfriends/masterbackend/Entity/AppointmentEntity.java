package com.furryfriends.masterbackend.Entity;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
// import jakarta.persistence.*;

// import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "AppointmentEntity")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "appointmentId")
public class AppointmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointmentId")
    private int appointmentId;

    @Column(name = "appointmentDate")
    private Date appointmentDate;

    @Column(name = "appointmentTime")
    private String appointmentTime;

    @Column(name = "status")
    private String status;



    // Many-to-one relationship with VetEntity
    @ManyToOne
    @JoinColumn(name = "vetid")
    //@JsonManagedReference(value= "vet-appointment")

    private VetEntity vet;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "billing_id", referencedColumnName = "billingId")
    private BillingEntity billing;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    //@JsonManagedReference("pet-appointment")
    private PetEntity pet;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private OwnerEntity owner;
    
    public AppointmentEntity() {
        super();
    }

    public AppointmentEntity(int appointmentId, Date appointmentDate, String appointmentTime, String status, VetEntity vet, PetEntity pet) {
        this.appointmentId = appointmentId;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.vet = vet;
        this.pet = pet;
    }

    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Date getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(Date appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public VetEntity getVet() {
        return vet;
    }

    public void setVet(VetEntity vet) {
        this.vet = vet;
    }

    public BillingEntity getBilling() {
        return billing;
    }

    public void setBilling(BillingEntity billing) {
        this.billing = billing;
    }

    public PetEntity getPet() {
        return pet;
    }

    public void setPet(PetEntity pet) {
        this.pet = pet;
    }

    public OwnerEntity getOwner() {
        return owner;
    }

    public void setOwner(OwnerEntity owner) {
        this.owner = owner;
    }

    
}