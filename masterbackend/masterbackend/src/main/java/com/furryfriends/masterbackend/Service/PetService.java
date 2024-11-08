package com.furryfriends.masterbackend.Service;

import com.furryfriends.masterbackend.Entity.PetEntity;
import com.furryfriends.masterbackend.Repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PetService {
    @Autowired
    PetRepository prepo;

    public PetService(){
        super();
    }

    public PetEntity postPetRecord(PetEntity pet){
        return prepo.save(pet);
    }

    public List<PetEntity> getAllPets(){
        return prepo.findAll();
    }

    public PetEntity getPetById(int pid) {
        return prepo.findById(pid).orElseThrow(() -> new NoSuchElementException("Pet with ID " + pid + " not found!"));
    }



    public PetEntity putPetDetails(int pid, PetEntity newPetDetails) {
        PetEntity pet = prepo.findById(pid).orElseThrow(() -> new NoSuchElementException("Pet with ID " + pid + " not found!"));

        // Update the pet details
        pet.setPetName(newPetDetails.getPetName());
        pet.setSpecies(newPetDetails.getSpecies());
        pet.setBreed(newPetDetails.getBreed());
        pet.setWeight(newPetDetails.getWeight());
        pet.setAge(newPetDetails.getAge());
        pet.setMedRec(newPetDetails.getMedRec());

        // Save and return the updated pet
        return prepo.save(pet);
    }

    public String deletePet(int pid) {
        // Check if the teacher exists by ID
        if (prepo.existsById(pid)) {
            // Perform the deletion
            prepo.deleteById(pid);
            return "Pet record with ID " + pid + " successfully deleted";
        } else {
            // Return message if the teacher is not found
            return "Pet with ID " + pid + " Not Found!";
        }
    }
}