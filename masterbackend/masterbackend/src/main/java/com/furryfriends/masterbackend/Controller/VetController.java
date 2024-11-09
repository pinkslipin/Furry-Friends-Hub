package com.furryfriends.masterbackend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.furryfriends.masterbackend.Entity.VetEntity;
import com.furryfriends.masterbackend.Service.VetService;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/vet")
public class VetController {


@Autowired

VetService vserv;


// Simple print method for testing
@GetMapping("/print")
public String print() {
    return "Vet Controller is working!";
}

//Create of CRUD

@PostMapping("/postvetrecord")

public VetEntity postVetRecord(@RequestBody VetEntity vet) {

return vserv.postVetRecord(vet);

}


//Read of CRUD

@GetMapping("/getAllVets")

public List<VetEntity> getAllVets(){

return vserv.getAllVets();

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