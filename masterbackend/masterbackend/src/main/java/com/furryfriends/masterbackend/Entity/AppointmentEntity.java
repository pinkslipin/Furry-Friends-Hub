package com.furryfriends.masterbackend.Entity;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "AppointmentEntity")
@JsonPropertyOrder({ "appointmentId", "appointmentDate", "appointmentTime", "status", "vets" })
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
   // @JsonBackReference("appointment-vet")
    private VetEntity vets;

    // // One-to-one relationship with BillingEntity
    // @OneToOne(cascade = CascadeType.ALL)
    // @JoinColumn(name = "billing_id", referencedColumnName = "billingId")
    // @JsonManagedReference("appointment-billing")
    // private BillingEntity billing;

    // // Many-to-one relationship with PetEntity
    // @ManyToOne
    // @JoinColumn(name = "pet_id")  // Foreign key column in AppointmentEntity
    // @JsonBackReference("appointment-pet")
    //private PetEntity pet;

    public AppointmentEntity() {
        super();
    }

    public AppointmentEntity(int appointmentId, Date appointmentDate, String appointmentTime, String status, VetEntity vets/* , PetEntity pet*/) {
        this.appointmentId = appointmentId;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.vets = vets;
        //this.pet = pet;
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

    public VetEntity getVets() {
        return vets;
    }

    public void setVets(VetEntity vets) {
        this.vets = vets;
    }

    // public BillingEntity getBilling() {
    //     return billing;
    // }

    // public void setBilling(BillingEntity billing) {
    //     this.billing = billing;
    // }

    // public PetEntity getPet() {
    //     return pet;
    // }

    // public void setPet(PetEntity pet) {
    //     this.pet = pet;
    // }
}
