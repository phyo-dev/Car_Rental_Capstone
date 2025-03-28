package com.mzp.carrental.dto;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Data;

@Data
public class AgencyDTO {
    private Integer id;
    private String email;
    private String username;
    private String phoneNumber;
    private String address;
    private String city;
    private Integer totalCar;
    private String verificationStatus;

    // Getters and setters


    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public Integer getTotalCar() {
        return totalCar;
    }

    public void setTotalCar(Integer totalCar) {
        this.totalCar = totalCar;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    // Add other fields as necessary


    public AgencyDTO(Integer id, String email, String username, String phoneNumber, String address, String city, Integer totalCar, String verificationStatus) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.totalCar = totalCar;
        this.verificationStatus = verificationStatus;
    }
}
