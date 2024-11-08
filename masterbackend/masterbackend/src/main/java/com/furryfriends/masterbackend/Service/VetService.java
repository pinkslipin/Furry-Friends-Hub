package com.furryfriends.masterbackend.Service;

import java.util.List;
import java.util.NoSuchElementException;
//import java.util.Optional;
import javax.naming.NameNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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



} 