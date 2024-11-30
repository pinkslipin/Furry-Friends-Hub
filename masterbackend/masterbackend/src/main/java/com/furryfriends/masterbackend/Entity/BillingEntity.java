package com.furryfriends.masterbackend.Entity;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "billing")
public class BillingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer billingId;
    private Date billingDate;
    private double amountDue;
    private double amountPaid;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private OwnerEntity owner;

    // Constructors
    public BillingEntity() {}

    public BillingEntity(Date billingDate, double amountDue, double amountPaid, OwnerEntity owner) {
        this.billingDate = billingDate;
        this.amountDue = amountDue;
        this.amountPaid = amountPaid;
        this.owner = owner;
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

    public OwnerEntity getOwner() {
        return owner;
    }

    public void setOwner(OwnerEntity owner) {
        this.owner = owner;
    }

}