package com.furryfriends.masterbackend.DTO;

import java.sql.Date;

public class BillingDTO {
    private Integer billingId;
    private Date billingDate;
    private Double amountDue;
    private Double amountPaid;
    private Integer ownerId;
    private String ownerFname;
    private String ownerLname;
    private String ownerImage;

    // Getters and Setters
    public int getBillingId() {
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

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerFname() {
        return ownerFname;
    }

    public void setOwnerFname(String ownerFname) {
        this.ownerFname = ownerFname;
    }

    public String getOwnerLname() {
        return ownerLname;
    }

    public void setOwnerLname(String ownerLname) {
        this.ownerLname = ownerLname;
    }

    public String getOwnerImage() {
        return ownerImage;
    }

    public void setOwnerImage(String ownerImage) {
        this.ownerImage = ownerImage;
    }
}