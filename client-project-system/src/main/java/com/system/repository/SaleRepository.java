package com.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.system.model.Sale;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Integer> {

}
