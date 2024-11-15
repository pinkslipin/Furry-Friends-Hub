package com.furryfriends.masterbackend.DTO;

public class PetRecordRequest {

    private String petName;
    private String species;
    private String breed;
    private int weight;
    private int age;
    private String medRec;
    private int ownerId;

    // Getters and setters

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

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }
}

