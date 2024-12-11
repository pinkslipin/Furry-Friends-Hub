package com.furryfriends.masterbackend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.furryfriends.masterbackend.DTO.Login;
import com.furryfriends.masterbackend.DTO.Signup;
import com.furryfriends.masterbackend.Entity.OwnerEntity;
import com.furryfriends.masterbackend.Service.AuthenticationService;
import com.furryfriends.masterbackend.Service.OwnerService;
import com.furryfriends.masterbackend.Service.PetService;

@RestController
@RequestMapping("/api/furryfriendshubowner")
@CrossOrigin(origins = "http://localhost:3000")
public class OwnerController {

    @Autowired
    OwnerService oserv;

    @Autowired
    AuthenticationService aserv;

    @Autowired
    PetService pserv;

    @GetMapping("/")
    public String index() {
        return "index.html";
    }
    
    @GetMapping("/print")
    public String print() {
        return "Hello, Welcome to FurryFriends Hub";
    }

    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody Signup signupRequest) {
        aserv.registerOwner(signupRequest);
        return ResponseEntity.ok("Signup successful!");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Login loginRequest) {
        boolean isAuthenticated = aserv.loginOwner(loginRequest);
        if (isAuthenticated) {
            return ResponseEntity.ok("Login successful!");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
    }

    @GetMapping("/profile")
    public ResponseEntity<OwnerEntity> getUserProfile(@AuthenticationPrincipal OwnerEntity ownerEntity) {
        String email = ownerEntity.getEmail();
        OwnerEntity owner = oserv.findByEmail(email);
        if (owner != null) {
            return ResponseEntity.ok(owner);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/postowneraccount")
    public OwnerEntity postOwnerAccount(@RequestBody OwnerEntity user) {
        return oserv.postOwnerAccounts(user);
    }

    @GetMapping("/getAllOwners")
    public List<OwnerEntity> getAllOwner() {
        return oserv.getAllOwners();
    }

    @PutMapping("/profile/edit/{id}")
    public ResponseEntity<OwnerEntity> editProfile(@PathVariable int id, @RequestBody OwnerEntity updatedProfile) {
        OwnerEntity updatedOwner = oserv.updateProfile(id, updatedProfile);
        return ResponseEntity.ok(updatedOwner);
    }

    @DeleteMapping("/deleteOwnerDetails/{id}")
    public String deleteOwners(@PathVariable int id) {
        return oserv.deleteOwner(id);
    }

    @PostMapping("/profile/uploadImage")
    public ResponseEntity<?> uploadOwnerImage(@RequestParam("ownerId") int ownerId, @RequestParam("image") MultipartFile file) {
        try {
            OwnerEntity owner = oserv.findById(ownerId); 
            if (owner == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Owner not found");
            }

            owner.setImage(file.getBytes());
            oserv.save(owner); 
            return ResponseEntity.ok("Image uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image: " + e.getMessage());
        }
    }

    @GetMapping("/profile/image/{ownerId}")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable int ownerId) {
        OwnerEntity owner = oserv.findById(ownerId);
        if (owner == null || owner.getImage() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok()
                .header("Content-Type", "image/jpeg")
                .body(owner.getImage());
    }
    
    @PostMapping("/adopt")
    public ResponseEntity<String> adoptPet(@RequestParam int ownerId, @RequestParam int animalId) {
        String result = pserv.adoptPet(ownerId, animalId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/adoptRequest")
    public ResponseEntity<String> requestAdoption(@RequestParam int ownerId, @RequestParam int animalId) {
        String result = pserv.requestAdoption(ownerId, animalId);
        return ResponseEntity.ok(result);
    }
}
