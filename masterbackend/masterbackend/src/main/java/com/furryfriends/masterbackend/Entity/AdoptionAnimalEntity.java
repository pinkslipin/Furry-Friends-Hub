package com.furryfriends.masterbackend.Entity;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="adoptionanimal")
public class AdoptionAnimalEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "animalid")  // Changed from adoptionanimalid to match the field name
    private int animalid;

    @Column(name = "animalname")
    private String animalname;

    @Column(name = "species")
    private String species;

    @Column(name = "breed")
    private String breed;

    @Column(name = "age")
    private int age;

    @Column(name = "status")
    private String status;

    @Column(name = "sex")
    private String sex;

    @Column(name = "animalimage", columnDefinition = "LONGBLOB")
    private byte[] image;

    public AdoptionAnimalEntity() {
        super();
    }

    public AdoptionAnimalEntity(int animalid, String animalname, String species, String breed, int age, String status, String sex) {
        super();
        this.animalid = animalid;
        this.animalname = animalname;
        this.species = species;
        this.breed = breed;
        this.age = age;
        this.status = status;
        this.sex = sex;
    }

    public int getAnimalid() {
        return animalid;
    }

    public void setAnimalid(int animalid) {
        this.animalid = animalid;
    }

    public String getAnimalname() {
        return animalname;
    }

    public void setAnimalname(String animalname) {
        this.animalname = animalname;
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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSex(){
        return sex;
    }

    public void setSex(String sex){
        this.sex = sex;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

}
