package com.furryfriends.masterbackend.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tbladoptionrequest")
public class AdoptionRequestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int request_id;

    @Column(name = "request_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime requestDate;

    @Column(name = "request_status")
    private String requestStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ownerId")
    @JsonBackReference
    private OwnerEntity owner;

    public AdoptionRequestEntity() {
        super();
    }

    public AdoptionRequestEntity(LocalDateTime requestDate, String requestStatus, OwnerEntity owner) {
        super();
        this.requestDate = requestDate;
        this.requestStatus = requestStatus;
        this.owner = owner;
    }

    public int getRequestId() {
        return request_id;
    }

    public void setRequestId(int request_id) {
        this.request_id = request_id;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(String requestStatus) {
        this.requestStatus = requestStatus;
    }

    public OwnerEntity getOwner() {
        return owner;
    }

    public void setOwner(OwnerEntity owner) {
        this.owner = owner;
    }

    public int getOwnerId() {
        return this.owner != null ? this.owner.getOwnerId() : 0;
    }
}
