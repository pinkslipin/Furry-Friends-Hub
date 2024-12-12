package com.furryfriends.masterbackend.Entity;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

@Entity
@Table(name = "VetEntity")
public class VetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VetID")
    private int vetid;

    @Column(name = "VetFirstname")
    private String fname;

    @Column(name = "VetLastname")
    private String lname;

    @Column(name = "VetSpecialization")
    private String specialization;

    @Column(name = "VetNumber")
    private String phoneNum;

    @Column(name = "VetEmail")
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "role")
    private String role;

    @Column(name = "VetImage", columnDefinition = "LONGBLOB")
    private byte[] image;

    // Constructors
    public VetEntity() {}

    public VetEntity(int vetid, String fname, String lname, String specialization, String phoneNum, String email, String password, String role) {
        this.vetid = vetid;
        this.fname = fname;
        this.lname = lname;
        this.specialization = specialization;
        this.phoneNum = phoneNum;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public int getVetid() {
        return vetid;
    }

    public void setVetid(int vetid) {
        this.vetid = vetid;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
}