package com.furryfriends.masterbackend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.furryfriends.masterbackend.Entity.PetEntity;
import com.furryfriends.masterbackend.Service.PetService;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/pet")
@CrossOrigin(origins = "http://localhost:3000")
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
