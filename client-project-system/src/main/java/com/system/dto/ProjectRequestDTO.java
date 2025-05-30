package com.system.dto;

import java.util.List;

import com.system.model.Activity;

public class ProjectRequestDTO {

	private String description;
    private Integer clientId;
    private Integer statusId;
    private List<Activity> activities;

	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getClientId() {
		return clientId;
	}
	public void setClientId(Integer clientId) {
		this.clientId = clientId;
	}
	public Integer getStatusId() {
		return statusId;
	}
	public void setStatusId(Integer statusId) {
		this.statusId = statusId;
	}
	public List<Activity> getActivities() { 
		return activities; 
	} 
	public void	setActivities(List<Activity> activities) { 
		this.activities = activities; 
	}
}
