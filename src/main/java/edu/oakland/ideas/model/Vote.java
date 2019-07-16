package edu.oakland.ideas.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Vote {
  private int ideaID;
  private String userPidm;
  private int voteValue;
  private Timestamp votedAt = Timestamp.valueOf(LocalDateTime.now());

  public Vote() {}

  public Vote(int ideaID, String userPidm, int voteValue, Timestamp votedAt) {
    this.ideaID = ideaID;
    this.userPidm = userPidm;
    this.voteValue = voteValue;
    this.votedAt = votedAt;
  }

  public Vote(int ideaID, int voteValue) {
    this.ideaID = ideaID;
    this.voteValue = voteValue;
  }

  public String toString() {
    return ("idea_id: "
        + ideaID
        + "\nuser_pidm: "
        + userPidm
        + "\nvote_value: "
        + voteValue
        + "\nvote_timestamp: "
        + votedAt);
  }
}
