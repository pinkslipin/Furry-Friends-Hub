package com.furryfriends.masterbackend.Entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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

    @Column(name = "role")
    private String role = "OWNER";

    @Column(name = "OwnerImage", columnDefinition = "LONGBLOB")
    private byte[] image;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<AdoptionRequestEntity> adoptionRequests;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("owner-pets")
    private List<PetEntity> petList = new ArrayList<>();

    //@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    //@JsonManagedReference("owner-appointments")
    //private List<AppointmentEntity> appointments;

    public OwnerEntity() {
        super();
    }



    public OwnerEntity(int ownerId, String fname, String lname, String email, String phone_number, String address, 
    String payment_type, String password, String role) {
        super();
        this.ownerId = ownerId;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.phoneNumber = phone_number;
        this.address = address;
        this.paymentType = payment_type;
        this.password = password;
        this.role = role;
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

    public List<PetEntity> getPetList() {
        return petList;
    }

    public void setPetList(List<PetEntity> petList) {
        this.petList = petList;
    }

    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    //public List<AppointmentEntity> getAppointments() {
    //    return appointments;
    //}

    //public void setAppointments(List<AppointmentEntity> appointments) {
    //    this.appointments = appointments;
    //}

    
}