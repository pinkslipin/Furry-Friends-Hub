package com.furryfriends.masterbackend.Service;

import java.util.List;
import java.util.NoSuchElementException;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furryfriends.masterbackend.Entity.MedicalRecordEntity;
import com.furryfriends.masterbackend.Repository.MedicalRecordRepository;

import com.furryfriends.masterbackend.Entity.PetEntity;
import com.furryfriends.masterbackend.Repository.PetRepository;

import com.furryfriends.masterbackend.Entity.VetEntity;
import com.furryfriends.masterbackend.Repository.VetRepository;

@Service

public class MedicalRecordService {

    @Autowired
    MedicalRecordRepository mrrepo;

	@Autowired
	PetRepository prepo;

	@Autowired
	VetRepository vrepo;

    public MedicalRecordService() {
        super();
    //TODO Auto-generated constructor stub
    }

    //Create of CRUD
    public MedicalRecordEntity postMedicalRecord(int petid, int vetid, MedicalRecordEntity medicalRecord) {
		PetEntity pet = prepo.findById(petid).orElseThrow(() -> new NoSuchElementException("Pet with ID " + petid + " not found"));

		VetEntity vet = vrepo.findById(vetid).orElseThrow(() -> new NoSuchElementException("Vet with ID " + vetid + " not found"));

		medicalRecord.setPet(pet);
		medicalRecord.setVet(vet);


        return mrrepo.save(medicalRecord);
    }

    //Read of CRUD

    public List<MedicalRecordEntity> getAllMedicalRecords(){
        return mrrepo.findAll();
    }
	
	public MedicalRecordEntity getMedicalRecord(int id){
		return mrrepo.findById(id).orElseThrow(() -> 
            new NoSuchElementException("Medical Record with ID " + id + " not found")
        );
	}

	public List<MedicalRecordEntity> getPetMedicalRecords(int petid){
		PetEntity pet = prepo.findById(petid).orElseThrow(() -> new NoSuchElementException("Pet with ID " + petid + " not found"));
		return mrrepo.findAllByPet(pet);
	}

	public List<MedicalRecordEntity> getVetMedicalRecords(int vetid){
		VetEntity vet = vrepo.findById(vetid).orElseThrow(() -> new NoSuchElementException("Vet with ID " + vetid + " not found"));

		return mrrepo.findAllByVet(vet);
	}
    
    //Update of CRUD	
	public MedicalRecordEntity putMedicalRecordDetails(int petid, int vetid, int id, MedicalRecordEntity newMedicalRecordDetails) {
		MedicalRecordEntity medicalRecord = new MedicalRecordEntity();
		
		//search id
		medicalRecord = mrrepo.findById(id).orElseThrow(() -> 
        	new NoSuchElementException("Medical Record with ID " + id + " not found")
    	);

		PetEntity pet = prepo.findById(petid).orElseThrow(() -> new NoSuchElementException("Pet with ID " + petid + " not found"));
		VetEntity vet = vrepo.findById(vetid).orElseThrow(() -> new NoSuchElementException("Vet with ID " + vetid + " not found"));

		if(medicalRecord.getPet().getPid() != pet.getPid()){
			medicalRecord.setPet(pet);
		}

		if(medicalRecord.getVet().getVetid() != vet.getVetid()){
			medicalRecord.setVet(vet);
		}
			
		//for setting new values (only when the id exists)
		medicalRecord.setRecordDate(newMedicalRecordDetails.getRecordDate());
		medicalRecord.setMedicalProcedure(newMedicalRecordDetails.getMedicalProcedure());
		medicalRecord.setMedication(newMedicalRecordDetails.getMedication());
		medicalRecord.setNotes(newMedicalRecordDetails.getNotes());

		return mrrepo.save(medicalRecord);
	}
	
	//Delete of CRUD
	public String deleteMedicalRecord(int id) {
		String msg = "";
		if(mrrepo.existsById(id)) {
			mrrepo.deleteById(id);
			msg = "Medical Record successfully deleted";
		}
		else msg = "Medical Record with ID " + id + " not found";
		
		return msg;
	}
}