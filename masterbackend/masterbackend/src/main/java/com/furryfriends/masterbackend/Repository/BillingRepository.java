package com.furryfriends.masterbackend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.furryfriends.masterbackend.Entity.BillingEntity;


@Repository
public interface BillingRepository extends JpaRepository<BillingEntity, Integer> {
    BillingEntity findByBillingId(int billingId);
    List<BillingEntity> findByOwner_OwnerId(int ownerId);
}