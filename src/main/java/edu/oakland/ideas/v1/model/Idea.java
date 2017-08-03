package edu.oakland.ideas.v1.model;
import java.util.LinkedList;

import lombok.Data;

@Data
public class Idea {
    private String title;
    private String description;
    private boolean approved;
    private Approver approvedBy;
    private String createdBy;
    private boolean active;
    private String approvedAt;
    private String createdAt;
    private String startVoteDate;
    private String endVoteDate;
    private int voteCount;
    private String category;
    private LinkedList<Vote> votesList;
}
