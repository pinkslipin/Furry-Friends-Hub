package com.furryfriends.masterbackend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.furryfriends.masterbackend.Entity.MedicalRecordEntity;
import com.furryfriends.masterbackend.Service.MedicalRecordService;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/medicalrecords")

public class MedicalRecordController {
    @Autowired
    MedicalRecordService mrserv;

    @GetMapping("/print")
    public String print() {
        return "Hello, Dutosme Jan Raye";
    }

    //Create of CRUD
    @PostMapping("/postMedicalRecord/")
    public MedicalRecordEntity postStudentRecord(@RequestParam int petid, @RequestParam int vetid, @RequestBody MedicalRecordEntity medicalRecord) {
        return mrserv.postMedicalRecord(petid, vetid, medicalRecord);
    }

    //Read of CRUD

    @GetMapping("/getAllMedicalRecords")
    public List<MedicalRecordEntity> getAllMedicalRecords(){
        return mrserv.getAllMedicalRecords();
    }

    @GetMapping("/getAllMedicalRecord/{id}")
    public MedicalRecordEntity getMedicalRecord(@PathVariable int id){
        return mrserv.getMedicalRecord(id);
    }

    
    @GetMapping("/getPetMedicalRecords/{petid}")
    public List<MedicalRecordEntity> getPetMedicalRecord(@PathVariable int petid) {
        return mrserv.getPetMedicalRecords(petid);
    }
    
    @GetMapping("/getVetMedicalRecords/{vetid}")
    public List<MedicalRecordEntity> getVetMedicalRecord(@PathVariable int vetid) {
        return mrserv.getVetMedicalRecords(vetid);
    }
    

    //Update of CRUD
	@PutMapping("/putMedicalRecordDetails/{id}")
	public MedicalRecordEntity putMedicalRecordDetails(@RequestParam int petid, @RequestParam int vetid, @PathVariable int id, @RequestBody MedicalRecordEntity newMedicalRecordDetails) {
		return mrserv.putMedicalRecordDetails(petid, vetid, id, newMedicalRecordDetails);	
	}
	
	//Delete of CRUD
	@DeleteMapping("/deleteMedicalRecord/{id}")
	public String deleteTeacher(@PathVariable int id) {
		return mrserv.deleteMedicalRecord(id);
	}
}
