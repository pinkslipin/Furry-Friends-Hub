package com.furryfriends.masterbackend.DTO;

public class AdoptionAnimal {
    private int animalid;      // changed from animalId
    private String animalname; // changed from animalName
    private String species;
    private String breed;
    private int age;
    private String status;
    private String sex;
    private byte[] image;

    public AdoptionAnimal() {}

    public AdoptionAnimal(int animalid, String animalname, String species, String breed, int age, String status, String sex, byte[] image) {
        this.animalid = animalid;
        this.animalname = animalname;
        this.species = species;
        this.breed = breed;
        this.age = age;
        this.status = status;
        this.sex = sex;
        this.image = image;
    }

    // Getters and Setters
    public int getAnimalid() { return animalid; }              // changed method name
    public void setAnimalid(int animalid) { this.animalid = animalid; } // changed method name
    public String getAnimalname() { return animalname; }       // changed method name
    public void setAnimalname(String animalname) { this.animalname = animalname; } // changed method name
    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }
    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { this.image = image; }
}
