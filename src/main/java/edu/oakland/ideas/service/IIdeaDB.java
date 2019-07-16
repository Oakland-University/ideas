package edu.oakland.ideas.service;

import edu.oakland.ideas.model.*;

import java.util.List;

public interface IIdeaDB {

  public List<Idea> getIdeaList(int ideaNumber);

  public void addIdea(Idea idea);

  public void submitVote(Vote vote);

  public List<Idea> getUnapprovedIdeas(int ideaNumber);

  public List<Idea> getAdminIdeas(int category, int ideaNumber);

  public boolean isAdmin(String pidm);

  public List<Idea> getWaitingIdeas(int ideaNumber);

  public void editIdea(Idea idea);

  public List<Idea> getArchiveIdeas(int ideaNumber);

  public List<Idea> getFlaggedIdeas(int ideaNumber);

  public void flagIdea(Idea idea);

  public void archiveIdea(Idea idea);

  public boolean isListEmpty();
}
