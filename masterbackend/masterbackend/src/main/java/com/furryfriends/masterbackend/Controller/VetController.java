package com.furryfriends.masterbackend.Controller;

import java.util.Base64;
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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.furryfriends.masterbackend.DTO.VetLogin;
import com.furryfriends.masterbackend.DTO.VetProfileResponse;
import com.furryfriends.masterbackend.DTO.VetSignup;
import com.furryfriends.masterbackend.Entity.VetEntity;
import com.furryfriends.masterbackend.Service.VetService;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/vet")
@CrossOrigin(origins = "http://localhost:3000")
public class VetController {


@Autowired

VetService vserv;


// Simple print method for testing
@GetMapping("/print")
public String print() {
    return "Vet Controller is working!";
}

//Create of CRUD
@PostMapping("/uploadImage")
public ResponseEntity<?> uploadVetImage(@RequestParam("vetId") int vetId, @RequestParam("image") MultipartFile file) {
    try {
        VetEntity vet = vserv.findById(vetId); // Implement a `findById` method in `VetService`
        if (vet == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vet not found");
        }

        vet.setImage(file.getBytes());
        vserv.save(vet); // Save the updated vet with the image
        return ResponseEntity.ok("Image uploaded successfully");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image: " + e.getMessage());
    }
}

@PostMapping("/postvetrecord")
public ResponseEntity<?> postVetRecord(@RequestBody VetEntity vet) {
    try {
        VetEntity savedVet = vserv.postVetRecord(vet);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVet);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating vet record: " + e.getMessage());
    }
}

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody VetLogin vetLogin) {
    try {
        VetEntity vet = vserv.authenticateVet(vetLogin.getEmail(), vetLogin.getPassword());
        return ResponseEntity.ok(vet);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}

@PostMapping("/signup")
public ResponseEntity<?> signup(@RequestBody VetSignup vetSignup) {
    try {
        // Call the signup method in VetService
        VetEntity vet = vserv.signupVet(vetSignup);
        return ResponseEntity.status(HttpStatus.CREATED).body(vet); // Return the created vet entity
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error during signup: " + e.getMessage());
    }
}

//Read of CRUD

@GetMapping("/getAllVets")

public List<VetEntity> getAllVets(){

return vserv.getAllVets();

}

@GetMapping("/profile")
public ResponseEntity<?> getVetByEmail(@RequestParam String email) {
    try {
        VetEntity vet = vserv.findByEmail(email);
        if (vet != null) {
            // Convert the image to Base64
            String imageBase64 = vet.getImage() != null ? Base64.getEncoder().encodeToString(vet.getImage()) : null;
            VetProfileResponse response = new VetProfileResponse(vet, imageBase64);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vet not found");
        }
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
    }
}


// Update of CRUD
	@PutMapping("/putVetDetails")
		public VetEntity putVetDetails(@RequestParam int vetid, @RequestBody VetEntity newVetDetails){
			return vserv.putVetDetails(vetid, newVetDetails);
		}

// Delete of CRUD
    @DeleteMapping("/deleteVet/{vetid}")
    public ResponseEntity<String> deleteVetRecord(@PathVariable int vetid) {
        String message = vserv.deleteVetRecord(vetid); // Call the service method

        if (message.contains("successfully deleted")) {
            return ResponseEntity.ok(message); // 200 OK response with message
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message); // 404 Not Found response with message
        }
    }


}