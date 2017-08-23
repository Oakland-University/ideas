package edu.oakland.ideas.v1.service;

import edu.oakland.ideas.v1.model.*;
import java.util.List;


public interface IIdeaDB {

  public void getIdea();

  public List<Idea> getIdeaList(int ideaNumber);
}

