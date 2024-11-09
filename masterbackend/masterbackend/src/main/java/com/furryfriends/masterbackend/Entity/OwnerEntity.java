package com.furryfriends.masterbackend.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table (name = "tblowneraccount")
public class OwnerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ownerId; 

    @Column(name = "firstname")
    private String fname;
    
    private String lname;
    private String email;
    private String phoneNumber;
    private String address;
    private String paymentType;
    private String password;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<AdoptionRequestEntity> adoptionRequests;

    public OwnerEntity() {
        super();
    }

    public OwnerEntity(int ownerId, String fname, String lname, String email, String phone_number, String address, 
    String payment_type, String password) {
        super();
        this.ownerId = ownerId;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.phoneNumber = phone_number;
        this.address = address;
        this.paymentType = payment_type;
        this.password = password;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public String getFName() {
        return fname;
    }

    public void setFName(String fName) {
        this.fname = fName;
    }

    public String getLName() {
        return lname;
    }

    public void setLName(String lName) {
        this.lname = lName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phone_number) {
        this.phoneNumber = phone_number;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String payment_type) {
        this.paymentType = payment_type;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<AdoptionRequestEntity> getAdoptionRequests() {
        return adoptionRequests;
    }

    public void setAdoptionRequests(List<AdoptionRequestEntity> adoptionRequests) {
        this.adoptionRequests = adoptionRequests;
    }
}