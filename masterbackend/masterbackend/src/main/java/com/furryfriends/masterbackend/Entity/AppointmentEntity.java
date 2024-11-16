package com.furryfriends.masterbackend.Entity;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

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
@JsonPropertyOrder({ "appointmentId", "appointmentDate", "appointmentTime", "status", "vet" })
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
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "vetid")
    @JsonManagedReference(value= "vet-appointment")
    private VetEntity vet;

    // One-to-one relationship with BillingEntity
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "billing_id", referencedColumnName = "billingId")
    @JsonManagedReference (value = "billing-appointment")
    private BillingEntity billing;

    // Many-to-one relationship with PetEntity
    @ManyToOne
    @JoinColumn(name = "pet_id")  // Foreign key column in AppointmentEntity
    @JsonManagedReference(value = "pet-appointment")
    private PetEntity pet;

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
}