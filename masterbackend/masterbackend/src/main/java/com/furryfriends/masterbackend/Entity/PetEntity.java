package com.furryfriends.masterbackend.Entity;

import java.util.List;
//import com.fasterxml.jackson.annotation.JsonManagedReference;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="tblpet")
public class PetEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pid;

    @Column(name = "petName")
    private String petName;

    @Column(name = "species")
    private String species;

    @Column(name = "breed")
    private String breed;

    @Column(name = "weight")
    private int weight;

    @Column(name = "age")
    private int age;

    @Column(name = "medRec")
    private String medRec;

    // One-to-many relationship with AppointmentEntity
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    //@JsonManagedReference("pet-appointment")
    private List<AppointmentEntity> appointments;

    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "ownerId")
    //@JsonBackReference

     // Many-to-one relationship with VetEntity
     @ManyToOne(fetch = FetchType.EAGER, optional = true)
     @JoinColumn(name = "ownerId")
     @JsonBackReference
     private OwnerEntity owner;

    public PetEntity(){
        super();
    }

    public PetEntity(int pid, String petName, String species, String breed, int weight, int age, String medRec){
        super();
        this.pid = pid;
        this.petName = petName;
        this.species = species;
        this.breed = breed;
        this.weight = weight;
        this.age = age;
        this.medRec = medRec;
    }

    // Getters and setters
    public int getPid() {
        return pid;
    }

    public void setPid(int pid) {
        this.pid = pid;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getMedRec() {
        return medRec;
    }

    public void setMedRec(String medRec) {
        this.medRec = medRec;
    }

    public List<AppointmentEntity> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<AppointmentEntity> appointments) {
        this.appointments = appointments;
    }

    public OwnerEntity getOwner() {
        return owner;
    }

    public void setOwner(OwnerEntity owner) {
        this.owner = owner;
    }
}
