package com.furryfriends.masterbackend.Entity;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
//import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;


@Entity
@Table(name = "tblmedicalrecord")
public class MedicalRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int mrid;

    @NotEmpty
    @Column(nullable = false)
    @ColumnDefault("Not Recorded")
    private String recordDate;

    @NotEmpty
    @Column(nullable = false)
    private String medicalProcedure;

    @NotEmpty
    @Column(nullable = false)
    private String medication;

    @Column(nullable = false)
    private String notes;

    @ManyToOne
    @JoinColumn(name = "pid",nullable = false)
    PetEntity pet;

    @ManyToOne
    @JoinColumn(name = "vetid",nullable = false)
    VetEntity vet;

    public MedicalRecordEntity() {  
        super();
    }

    public MedicalRecordEntity(String recordDate, String medicalProcedure, String medication, String notes) {
        super();

        this.recordDate = recordDate;
        this.medicalProcedure = medicalProcedure;
        this.medication = medication;
        this.notes = notes;
    }

    public int getId(){
        return mrid;
    }

    public void setId(int mrid) {
        this.mrid = mrid;
    }

    public String getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(String recordDate) {
        this.recordDate = recordDate;
    }

    public String getMedicalProcedure() {
        return medicalProcedure;
    }

    public void setMedicalProcedure(String procedure) {
        this.medicalProcedure = procedure;
    }

    public String getMedication() {
        return medication;
    }

    public void setMedication(String medication) {
        this.medication = medication;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public PetEntity getPet(){
        return pet;
    }

    public void setPet(PetEntity pet){
        this.pet = pet;
    }

    public VetEntity getVet(){
        return vet;
    }

    public void setVet(VetEntity vet){
        this.vet = vet;
    }
}
