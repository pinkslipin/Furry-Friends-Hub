package com.furryfriends.masterbackend.Controller;

import com.furryfriends.masterbackend.Entity.PetEntity;
import com.furryfriends.masterbackend.Service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/pet")
@CrossOrigin(origins = "http://localhost:5173")
public class PetController {
    @Autowired
    PetService pserv;

    //Create Pet
    @PostMapping("/postPetRecord")
    public PetEntity postPetRecord(@RequestBody PetEntity pet) {
        return pserv.postPetRecord(pet);
    }

    //Read Pet
    @GetMapping("/getAllPets")
    public List<PetEntity> getAllPets() {
        return pserv.getAllPets();
    }

    //Read a specific pet by ID
    @GetMapping("/{pid}")
    public PetEntity getPetById(@PathVariable int pid) {
        return pserv.getPetById(pid);
    }

    //Update
   /* @PutMapping("/putPetDetails")
    public PetEntity putPetDetails(@RequestBody int pid, @RequestBody PetEntity newPetDetails) {
        return pserv.putPetDetails(pid, newPetDetails);
    }*/
    @PutMapping("/putPetDetails/{pid}")
    public PetEntity putPetDetails(@PathVariable int pid, @RequestBody PetEntity newPetDetails) {
        return pserv.putPetDetails(pid, newPetDetails);
    }

    //Delete
    @DeleteMapping("/deletePet/{pid}")
    public String deletePet(@PathVariable int pid) {
        return pserv.deletePet(pid);
    }
}
