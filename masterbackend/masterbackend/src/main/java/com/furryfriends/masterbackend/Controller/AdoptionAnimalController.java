package com.furryfriends.masterbackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.furryfriends.masterbackend.Service.AdoptionAnimalService;
import com.furryfriends.masterbackend.DTO.AdoptionAnimal;
import java.util.List;

@RestController
@RequestMapping("/api/adoption/animals")
@CrossOrigin(origins = "http://localhost:3000")
public class AdoptionAnimalController {
    
    @Autowired
    private AdoptionAnimalService service;

    @GetMapping("/list")
    public List<AdoptionAnimal> getAllAnimals() {
        return service.getAllAnimals();
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<AdoptionAnimal> getAnimalById(@PathVariable int id) {
        AdoptionAnimal animal = service.getAnimalById(id);
        return ResponseEntity.ok(animal);
    }

    @GetMapping("/status/{status}")
    public List<AdoptionAnimal> getAnimalsByStatus(@PathVariable String status) {
        return service.getAnimalsByStatus(status);
    }

    @PostMapping("/register")
    public ResponseEntity<AdoptionAnimal> createAnimal(@RequestBody AdoptionAnimal animal) {
        AdoptionAnimal created = service.createAnimal(animal);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AdoptionAnimal> updateAnimal(@PathVariable int id, @RequestBody AdoptionAnimal animal) {
        animal.setAnimalid(id);
        AdoptionAnimal updated = service.updateAnimal(animal);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable int id) {
        service.deleteAnimal(id);
        return ResponseEntity.ok().build();
    }
}
