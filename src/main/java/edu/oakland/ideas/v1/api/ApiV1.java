package edu.oakland.ideas.v1.api;
import java.util.LinkedList;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import edu.oakland.jwtservice.JwtService;
import io.jsonwebtoken.Claims;

import edu.oakland.ideas.v1.model.Idea;
import edu.oakland.ideas.v1.service.*;
import java.util.List;
import java.sql.Timestamp;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1")
public class ApiV1 {

    @Autowired IIdeaDB ideaDB;

    @RequestMapping("/getList")
    public List<Idea> idea(@RequestParam(value = "i", required = false, defaultValue = "5") int i) {

      if (i < 1) {
        return ideaDB.getIdeaList(5);
      }
      return ideaDB.getIdeaList(i); 
    }

    @PostMapping("/submitIdea")
    public void putIdea(@ModelAttribute Idea idea, HttpServletRequest request) {
      JwtService jwtService = new JwtService();
      Claims claims = jwtService.decrypt(request);
      System.out.println("\n\nCreating new idea:");
      idea.setCreatedAt(new Timestamp(System.currentTimeMillis()));
      idea.setCreatedBy((String)claims.get("pidm"));
      System.out.println(idea.toString());
      ideaDB.addIdea(idea);
    }
    
}
