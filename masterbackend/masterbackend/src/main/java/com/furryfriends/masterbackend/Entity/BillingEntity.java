package com.furryfriends.masterbackend.Entity;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "billing")
public class BillingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int billingId;

    private Date billingDate;
    private double amountDue;
    private double amountPaid;

    // Use @JsonManagedReference to manage the parent side of the relationship
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "billing", cascade = CascadeType.ALL)
    //@JsonBackReference(value = "billing-appointment")

    private AppointmentEntity appointment;

    //@ManyToOne(fetch = FetchType.LAZY)
    //@JsonBackReference(value = "owner-billing")
    //private OwnerEntity owner;
    

    // Default Constructor
    public BillingEntity() {}

    // Parameterized Constructor
    public BillingEntity(int billingId, Date billingDate,double amountDue, double amountPaid, AppointmentEntity appointment) {
        this.billingId = billingId;
        this.billingDate = billingDate;
        this.amountDue = amountDue;
        this.amountPaid = amountPaid;
        this.appointment = appointment;
    }

    // Getters and Setters
    public Integer getBillingId() {
        return billingId;
    }

    public void setBillingId(int billingId) {
        this.billingId = billingId;
    }

    public Date getBillingDate() {
        return billingDate;
    }

    public void setBillingDate(Date billingDate) {
        this.billingDate = billingDate;
    }

    public double getAmountDue() {
        return amountDue;
    }

    public void setAmountDue(double amountDue) {
        this.amountDue = amountDue;
    }

    public double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public AppointmentEntity getAppointment() {
        return appointment;
    }

    public void setAppointment(AppointmentEntity appointment) {
        this.appointment = appointment;
    }

    //public OwnerEntity getOwner() {
    //    return owner;
    //}

    //public void setOwner(OwnerEntity owner) {
    //    this.owner = owner;
    //}
}