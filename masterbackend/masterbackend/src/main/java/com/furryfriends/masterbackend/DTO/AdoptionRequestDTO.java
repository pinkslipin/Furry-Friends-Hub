package com.furryfriends.masterbackend.DTO;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class AdoptionRequestDTO {
    private LocalDateTime requestDate;
    private String requestStatus;
    private int ownerId;
    private int pid;  

    public AdoptionRequestDTO() {
        // Default constructor with current date and time in "Asia/Manila" timezone
        this.requestDate = ZonedDateTime.now(ZoneId.of("Asia/Manila")).toLocalDateTime(); 
    }

    public AdoptionRequestDTO(String requestStatus, int ownerId, int pid) {
        this.requestDate = ZonedDateTime.now(ZoneId.of("Asia/Manila")).toLocalDateTime();
        this.requestStatus = "pending";
        this.ownerId = ownerId;
        this.pid = pid;
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

    public int getPid() {
        return pid;
    }

    public void setPid(int pid) {
        this.pid = pid;
    }
}
