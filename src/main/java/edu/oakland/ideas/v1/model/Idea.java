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
    private String category;
    private String avatar;

    public Idea(){}

    public Idea(String title, String description, String createdBy, Timestamp createdAt, String category){
      this.title = title;
      this.description = description;
      this.createdBy = createdBy;
      this.createdAt = createdAt;
      this.category = category;
      this.approved = false;
      this.avatar = category.toUpperCase().substring(0,1);
    }

    public String toString(){
      String bob = title + "\n" + description + "\n" + createdAt.toString();
      return bob;
    }
}
