package com.furryfriends.masterbackend.DTO;

import com.furryfriends.masterbackend.Entity.VetEntity;

public class VetProfileResponse {
    private int vetid;
    private String fname;
    private String lname;
    private String specialization;
    private String phoneNum;
    private String email;
    private String role;
    private String imageBase64; // Base64 encoded image

    public VetProfileResponse(VetEntity vet, String imageBase64) {
        this.vetid = vet.getVetid();
        this.fname = vet.getFname();
        this.lname = vet.getLname();
        this.specialization = vet.getSpecialization();
        this.phoneNum = vet.getPhoneNum();
        this.email = vet.getEmail();
        this.role = vet.getRole();
        this.imageBase64 = imageBase64;
    }

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    

    // Getters and Setters
}

