package edu.oakland.ideas.v1.model;
import lombok.Data;

@Data
public class Vote {
    private String ideaID;
    private String userPidm;
    private int voteValue;
    private String votedAt;
}