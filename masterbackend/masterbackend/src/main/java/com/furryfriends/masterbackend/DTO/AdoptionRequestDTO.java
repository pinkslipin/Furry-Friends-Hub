package com.furryfriends.masterbackend.DTO;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class AdoptionRequestDTO {
    private LocalDateTime requestDate;
    private String requestStatus;
    private int ownerId;
    private int petId;  // Renamed from 'pid' to 'petId'

    public AdoptionRequestDTO() {
        // Default constructor with current date and time in "Asia/Manila" timezone
        this.requestDate = ZonedDateTime.now(ZoneId.of("Asia/Manila")).toLocalDateTime(); 
    }

    public AdoptionRequestDTO(String requestStatus, int ownerId, int petId) {
        this.requestDate = ZonedDateTime.now(ZoneId.of("Asia/Manila")).toLocalDateTime();
        this.requestStatus = requestStatus;
        this.ownerId = ownerId;
        this.petId = petId;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public String getFormattedRequestDate() {
        return requestDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm")); 
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

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public int getPetId() {
        return petId;
    }

    public void setPetId(int petId) {
        this.petId = petId;
    }
}
