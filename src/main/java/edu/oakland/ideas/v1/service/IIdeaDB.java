package edu.oakland.ideas.v1.service;

import edu.oakland.ideas.v1.model.*;
import java.util.List;
import java.sql.Timestamp;


public interface IIdeaDB {

  public void getIdea();

  public List<Idea> getIdeaList(int ideaNumber, String pidm);

  public void addIdea(Idea idea);

  public void submitVote(Vote vote);

  public void logForAdmin(String description, String ideaID, String pidm, Timestamp time);
}

