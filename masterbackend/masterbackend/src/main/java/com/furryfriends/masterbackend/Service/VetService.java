package com.furryfriends.masterbackend.Service;

import java.util.List;
import java.util.NoSuchElementException;
//import java.util.Optional;
import javax.naming.NameNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.DTO.VetSignup; // Import your VetSignup DTO
import com.furryfriends.masterbackend.Entity.VetEntity;
import com.furryfriends.masterbackend.Repository.VetRepository;

@Service
public class VetService {


@Autowired

VetRepository vrepo;


public VetService() {

super();

// TODO Auto-generated constructor stub

}

    // Add a signup method
    public VetEntity signupVet(VetSignup vetSignup) throws Exception {
        // Check if the email already exists in the database
        VetEntity existingVet = vrepo.findByEmail(vetSignup.getEmail());
        if (existingVet != null) {
            throw new Exception("Email already in use");
        }

        // Create a new VetEntity and map the data from VetSignup
        VetEntity newVet = new VetEntity();
        newVet.setFname(vetSignup.getFname());
        newVet.setLname(vetSignup.getLname());
        newVet.setEmail(vetSignup.getEmail());
        newVet.setPhoneNum(vetSignup.getPhoneNumber());
        newVet.setSpecialization(vetSignup.getSpecialization());
        newVet.setPassword(vetSignup.getPassword());

        // Save the new vet to the database
        return vrepo.save(newVet);
    }

//Create of CRUD

public VetEntity postVetRecord(VetEntity vet) {

return vrepo.save(vet);

}


//Read of CRUD

public List<VetEntity> getAllVets(){

return vrepo.findAll();

}

// Update of CRUD
@SuppressWarnings("finally")
public VetEntity putVetDetails(int vetid, VetEntity newVetDetails) {
    VetEntity vets = new VetEntity();
    try {
        // Search the vet by id
        vets = vrepo.findById(vetid).get();

        // Set the updated fields
        vets.setFname(newVetDetails.getFname());
        vets.setLname(newVetDetails.getLname());
        vets.setSpecialization(newVetDetails.getSpecialization());
        vets.setPhoneNum(newVetDetails.getPhoneNum());
        vets.setEmail(newVetDetails.getEmail());

        // Ensure password is updated if provided
        if (newVetDetails.getPassword() != null && !newVetDetails.getPassword().isEmpty()) {
            vets.setPassword(newVetDetails.getPassword());
        }
    } catch (NoSuchElementException nex) {
        throw new NameNotFoundException("Vet " + vetid + " not found");
    } finally {
        return vrepo.save(vets);
    }
}

public VetEntity findByEmail(String email) {
    return vrepo.findByEmail(email);
}

// Delete of CRUD
public String deleteVetRecord(int vetid) {
    String msg = "";
    if (vrepo.findById(vetid).isPresent()) {
        vrepo.deleteById(vetid);
        msg = "Vet Record successfully deleted!";
    } else {
        msg = vetid + " NOT found!";
    }
    return msg;
}

public VetEntity authenticateVet(String email, String password) throws Exception {
    VetEntity vet = vrepo.findByEmail(email);
    if (vet != null && vet.getPassword().equals(password)) {
        return vet;
    } else {
        throw new Exception("Invalid email or password");
    }
}


} 