package com.furryfriends.masterbackend.DTO;

public class PetResponseDTO {
    private int pid;
    private String petName;
    private String species;
    private String breed;
    private double weight;
    private int age;
    private String medRec;
    private String imageUrl;
    private String gender;
    private OwnerDTO owner;

    // DTO for owner information
    public static class OwnerDTO {
        private int ownerId;
        private String fname;
        private String lname;

        public OwnerDTO(int ownerId, String fname, String lname) {
            this.ownerId = ownerId;
            this.fname = fname;
            this.lname = lname;
        }

        // Getters and setters
        public int getOwnerId() { return ownerId; }
        public void setOwnerId(int ownerId) { this.ownerId = ownerId; }
        public String getFname() { return fname; }
        public void setFname(String fname) { this.fname = fname; }
        public String getLname() { return lname; }
        public void setLname(String lname) { this.lname = lname; }
    }

    // Getters and setters
    public int getPid() { return pid; }
    public void setPid(int pid) { this.pid = pid; }
    public String getPetName() { return petName; }
    public void setPetName(String petName) { this.petName = petName; }
    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getMedRec() { return medRec; }
    public void setMedRec(String medRec) { this.medRec = medRec; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public OwnerDTO getOwner() { return owner; }
    public void setOwner(OwnerDTO owner) { this.owner = owner; }
}
