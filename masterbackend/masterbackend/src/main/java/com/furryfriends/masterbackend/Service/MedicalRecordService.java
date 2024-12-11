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

import com.furryfriends.masterbackend.Entity.OwnerEntity;
import com.furryfriends.masterbackend.Repository.OwnerRepository;

@Service

public class MedicalRecordService {

    @Autowired
    MedicalRecordRepository mrrepo;

	@Autowired
	PetRepository prepo;

	@Autowired
	VetRepository vrepo;

	@Autowired
	OwnerRepository orepo;

    public MedicalRecordService() {
        super();
    //TODO Auto-generated constructor stub
    }

	final String medrecNotFoundMsg = "Medical Record does not exist";
	final String medrecAddedMsg = "Medical Record is added successfully";
	final String medrecUpdatedMsg = "Medical Record is successfully updated";
	final String medrecMissingMsg = "Input has one or more blank results.";
	final String petNotFoundMsg = "Pet does not exist";
	final String vetNotFoundMsg = "Vet does not exist";

    //Create of CRUD
    public String postMedicalRecord(int petid, int vetid, MedicalRecordEntity medicalRecord) {
		String msg = "";

		PetEntity pet = prepo.findById(petid).orElse(null);
		VetEntity vet = vrepo.findById(vetid).orElse(null);

		if(pet == null){
			msg = petNotFoundMsg;
		}
		if(vet == null){
			if(pet == null)msg += "\n";

			msg += vetNotFoundMsg;
		}
		if(medicalRecord.getRecordDate() == "" || medicalRecord.getMedication() == "" || medicalRecord.getMedicalProcedure() == ""){
			if(vet == null || pet == null){
				msg += "\n";
			}

			msg += medrecMissingMsg;
		}
		else if(pet != null && vet != null){
			medicalRecord.setPet(pet);
			medicalRecord.setVet(vet);

			mrrepo.save(medicalRecord);

			msg = medrecAddedMsg;
		}

        return msg;
    }

    //Read of CRUD

    public List<MedicalRecordEntity> getAllMedicalRecords(){
        return mrrepo.findAll();
    }
	
	public MedicalRecordEntity getMedicalRecord(int id){
		return mrrepo.findById(id).orElseThrow(() -> 
            new NoSuchElementException(medrecNotFoundMsg)
        );
	}

	public List<MedicalRecordEntity> getPetMedicalRecords(int petid){
		PetEntity pet = prepo.findById(petid).orElseThrow(() -> new NoSuchElementException(petNotFoundMsg));
		return mrrepo.findAllByPet(pet);
	}

	public List<MedicalRecordEntity> getVetMedicalRecords(int vetid){
		VetEntity vet = vrepo.findById(vetid).orElseThrow(() -> new NoSuchElementException(vetNotFoundMsg));

		return mrrepo.findAllByVet(vet);
	}

	public List<MedicalRecordEntity> getOwnerMedicalRecords(int ownerId) {
	    OwnerEntity owner = orepo.findById(ownerId).orElseThrow(() -> new NoSuchElementException("Owner not found"));
	    List<PetEntity> pets = owner.getPetList();
	    return mrrepo.findAllByPetIn(pets);
	}
    
    //Update of CRUD	
	public String putMedicalRecordDetails(int petid, int vetid, int id, MedicalRecordEntity newMedicalRecordDetails) {
		MedicalRecordEntity medicalRecord = new MedicalRecordEntity();
		String msg = "";
		
		//search id
		medicalRecord = mrrepo.findById(id).orElse(null);
    	
		if(medicalRecord != null){
			PetEntity pet = prepo.findById(petid).orElse(null);
			VetEntity vet = vrepo.findById(vetid).orElse(null);

			if(pet == null){
				msg = petNotFoundMsg;
			}
			if(vet == null){
				if(pet == null)msg += "\n";
	
				msg += vetNotFoundMsg;
			}
			if(medicalRecord.getRecordDate() == "" || medicalRecord.getMedication() == "" || medicalRecord.getMedicalProcedure() == ""){
				if(vet == null || pet == null){
					msg += "\n";
				}
	
				msg += medrecMissingMsg;
			}
			if(pet != null && vet != null){
				if(medicalRecord.getPet().getPid() != pet.getPid()){
					medicalRecord.setPet(pet);
				}

				if(medicalRecord.getVet().getVetid() != vet.getVetid()){
					medicalRecord.setVet(vet);
				}

				

				medicalRecord.setRecordDate(newMedicalRecordDetails.getRecordDate());
				medicalRecord.setMedicalProcedure(newMedicalRecordDetails.getMedicalProcedure());
				medicalRecord.setMedication(newMedicalRecordDetails.getMedication());
				medicalRecord.setNotes(newMedicalRecordDetails.getNotes());

				mrrepo.save(medicalRecord);

				msg = medrecUpdatedMsg;
			}
		}

		return msg;
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