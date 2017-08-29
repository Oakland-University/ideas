package edu.oakland.ideas.v1.api;
import java.util.LinkedList;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import edu.oakland.ideas.v1.model.Idea;
import edu.oakland.ideas.v1.service.*;
import java.util.List;
import java.sql.Timestamp;


@RestController
@RequestMapping("/api/v1")
public class ApiV1 {

    @Autowired IIdeaDB ideaDB;

    @RequestMapping("/getList")
    public List<Idea> idea(){
      return ideaDB.getIdeaList(5); 
    }

    @PostMapping("/submitIdea")
    public void putIdea(@ModelAttribute Idea idea){
      System.out.println("\n\nCreating new idea:");
      System.out.println(ideaDB.getCategoryInt("general"));
      idea.setCreatedAt(new Timestamp(System.currentTimeMillis()));
      ////TODO: Use KaJuan's jar file
      idea.setCreatedBy("amgoodfellow");
      System.out.println(idea.toString());
      ideaDB.addIdea(idea);
    }
    
}
