package com.furryfriends.masterbackend.Entity;

import jakarta.persistence.*;

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
}