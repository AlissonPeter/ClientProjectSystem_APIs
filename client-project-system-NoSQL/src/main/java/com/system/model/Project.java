package com.system.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Objects;

@Document
public class Project {

	@Id
	private String id;
	private String description;
	@Transient
	private Client client;
	private ObjectId clientId;
	@Transient
	private List<Activity> activities;
	@Transient
	private Status status;
	private String statusId;

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Client getClient() {
		return client;
	}
	public ObjectId getClientId() { return clientId; }
	public void setClientId(ObjectId clientId) {
		this.clientId = clientId;
	}
	public void setClient(Client client) {
		this.client = client;
		if (client != null) {
			clientId = new ObjectId(client.getId());
		}
	}
	public List<Activity> getActivities() {
		return activities;
	}
	public void setActivities(List<Activity> activities) {
		this.activities = activities;
	}
	public Status getStatus() {
		return status;
	}
	public String getStatusId() {
		return statusId;
	}
	public void setStatusId(String statusId) {
		this.statusId = statusId;
	}

	public void setStatus(Status status) {
		this.status = status;
		if (status != null) {
			statusId = status.getId();
		}
	}
	@Override
	public int hashCode() {
		return Objects.hash(activities, client, id, description/*, status*/);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Project other = (Project) obj;
		return Objects.equals(activities, other.activities) && Objects.equals(client, other.client)
				&& Objects.equals(id, other.id) && Objects.equals(description, other.description) && Objects.equals(status, other.status);
	}
	@Override
	public String toString() {
		return "Project [id=" + id + ", description=" + description + ", client=" + client + ", activities=" + activities
				+ ", status=" + status + "]";
	}
}
