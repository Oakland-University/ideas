package edu.oakland.ideas.v1.model;
import java.util.LinkedList;
import java.sql.Timestamp;

import lombok.Data;

@Data
public class Idea {
    private String title;
    private String description;
    private boolean approved;
    private Approver approvedBy;
    private String createdBy;
    private boolean active;
    private Timestamp approvedAt;
    private Timestamp createdAt;
    private Timestamp startVoteDate;
    private Timestamp endVoteDate;
    private int voteCount;
    private int category;

    public Idea(){
    }

    public Idea(String title, String description, String createdBy, Timestamp createdAt, int category){
      this.title = title;
      this.description = description;
      this.createdBy = createdBy;
      this.createdAt = createdAt;
      this.category = category;
    }

}
