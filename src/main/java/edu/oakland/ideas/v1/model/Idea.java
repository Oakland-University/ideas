package edu.oakland.ideas.v1.model;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class Idea {
  private int id;
  private String title;
  private String description;
  private boolean approved;
  private Timestamp approvedAt;
  private Approver approvedBy;
  private boolean isArchived;
  private Timestamp createdAt;
  private String createdBy;
  private String category;
  private boolean isFlagged;
  private Timestamp flaggedOn;
  private String flaggedBy;
  private Timestamp startVoteDate;
  private Timestamp endVoteDate;
  private int userVote;
  private int voteCount;
  private String avatar;

  //Idea is an object that takes parameters in the order they show up above for constructors 

  public Idea() {
  }

  //8
  public Idea(int id, String title, String description, String createdBy, Timestamp createdAt, String category,
      int voteCount, int userVote) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.category = category;
    this.approved = false;
    this.avatar = category.toUpperCase().substring(0, 1);
    this.voteCount = voteCount;
    this.userVote = userVote;
  }

  //9
  public Idea(int id, boolean approved, String title, String description, String createdBy, Timestamp createdAt,
      String category, int voteCount, int userVote) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.category = category;
    this.approved = approved;
    this.avatar = category.toUpperCase().substring(0, 1);
    this.voteCount = voteCount;
    this.userVote = userVote;
  }



  public Idea(int id, String title, String description, boolean approved, String createdBy, Timestamp createdAt,
      Timestamp startVoteDate, Timestamp endVoteDate, int voteCount, String category) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.approved = approved;
    this.avatar = category.toUpperCase().substring(0, 1);
    this.startVoteDate = startVoteDate;
    this.endVoteDate = endVoteDate;
  }

  public String toString() {
    String bob = title + "\n" + description + "\n" + String.valueOf(approved) + "\n" + createdBy + "\n"
        + String.valueOf(voteCount) + "\n" + String.valueOf(isFlagged);
    return bob;
  }
}
