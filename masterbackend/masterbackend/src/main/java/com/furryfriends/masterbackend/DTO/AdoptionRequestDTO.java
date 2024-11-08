package com.furryfriends.masterbackend.DTO;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class AdoptionRequestDTO {
    private LocalDateTime requestDate;
    private String requestStatus;
    private int ownerId;

    public AdoptionRequestDTO() {
        this.requestDate = ZonedDateTime.now(ZoneId.of("Asia/Manila")).toLocalDateTime(); 
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
}
