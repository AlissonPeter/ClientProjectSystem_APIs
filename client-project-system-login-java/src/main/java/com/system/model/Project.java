package com.system.model;

import java.util.List;
import java.util.Objects;

import jakarta.persistence.*;

@Entity
public class Project {

	@Id	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(length = 150, nullable = false)
	private String description;
	@ManyToOne
	@JoinColumn(name = "client_id", referencedColumnName = "id", nullable = false)
	private Client client;
	@OneToMany(mappedBy = "project", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Activity> activities;
	@ManyToOne
	@JoinColumn(name = "status_id", referencedColumnName = "id", nullable = false)
	private Status status;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
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
	public void setClient(Client client) {
		this.client = client;
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
	public void setStatus(Status status) {
		this.status = status;
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
