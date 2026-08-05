package com.system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.system.model.Sale;
import com.system.repository.SaleRepository;

@Service
public class SaleService {

	@Autowired
	private SaleRepository saleRepository;

	public Sale findById(Integer id) {
		return saleRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Sale not found"));
	}

	public void saveOrUpdate(Sale sale) {
		saleRepository.save(sale);
	}

	public void deleteById(Integer id) {
		saleRepository.deleteById(id);
	}

	public List<Sale> findAll() {
		return saleRepository.findAll();
	}
}
