package com.system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.system.model.Sale;
import com.system.service.SaleService;

@RestController
@RequestMapping("/sales")
@CrossOrigin(origins = "*")
public class SaleController {

	@Autowired
	private SaleService saleService;

	@GetMapping("{id}")
	public Sale getSaleById(@PathVariable Integer id) {
		return saleService.findById(id);
	}

	@PostMapping
	public Sale createSale(@RequestBody Sale sale) {
		saleService.saveOrUpdate(sale);
		return sale;
	}

	@DeleteMapping("{id}")
	public void deleteById(@PathVariable Integer id) {
		saleService.deleteById(id);
	}

	@PutMapping("{id}")
	public void updateById(@PathVariable Integer id, @RequestParam String description,
			@RequestParam Double price) {
		final Sale sale = getSaleById(id);
		sale.setDescription(description);
		sale.setPrice(price);
		saleService.saveOrUpdate(sale);
	}

	@GetMapping("/all")
	public List<Sale> findAll() {
		return saleService.findAll();
	}
}
