package edu.oakland.ideas.v1.api;
import java.util.LinkedList;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import edu.oakland.jwtservice.IJwtService;
import java.time.Instant;
import io.jsonwebtoken.Claims;
import java.util.HashMap;

import edu.oakland.ideas.v1.model.Idea;
import edu.oakland.ideas.v1.model.Vote;
import edu.oakland.ideas.v1.service.*;
import java.util.List;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin
@RestController
@RequestMapping("/api/v1")
public class ApiV1 {

    @Autowired IIdeaDB ideaDB;

    @Autowired IJwtService jwtService;

    @RequestMapping("/getList")
    public List<Idea> idea(@RequestParam(value = "i", required = false, defaultValue = "5") int i, HttpServletRequest request) {
        Claims claims = jwtService.decrypt(request);
        String pidm = (String) claims.get("pidm");
        if (i < 1) {
          return ideaDB.getIdeaList(5, pidm);
        }
        return ideaDB.getIdeaList(i, pidm); 
    }

    @RequestMapping("/getUnapprovedIdeas")
    public List<Idea> getUnapprovedIdeas(@RequestParam(value = "i", required = false, defaultValue = "50") int i, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (ideaDB.isAdmin(pidm)){
        return ideaDB.getUnapprovedIdeas(i);
      } else {
        return ideaDB.getIdeaList(5, pidm);
      }

    }

    @RequestMapping("/getWaitingIdeas")
    public List<Idea> getWaitingIdeas(@RequestParam(value = "i", required = false, defaultValue = "5") int i, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");


      if (ideaDB.isAdmin(pidm)){
        return ideaDB.getWaitingIdeas(i);
      } else {
        return ideaDB.getIdeaList(i, pidm);
      }

    }

    @RequestMapping("/getArchive")
    public List<Idea> getArchive(@RequestParam(value = "i", required = false, defaultValue = "10") int i, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (ideaDB.isAdmin(pidm)){
        return ideaDB.getArchiveIdeas(i);
      } else {
        return ideaDB.getIdeaList(i, pidm);
      }
    }

    @RequestMapping("/getFlagged")
    public List<Idea> getFlagged(@RequestParam(value = "i", required = false, defaultValue = "10") int i, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (ideaDB.isAdmin(pidm)){
        return ideaDB.getFlaggedIdeas(i);
      } else {
        return ideaDB.getIdeaList(i, pidm);
      }
    }

    @PostMapping("/editIdea")
    public void editIdea(@ModelAttribute Idea idea, HttpServletRequest request) {
      Claims claims = jwtService.decrypt(request);
      ideaDB.editIdea(idea);
    }

    @RequestMapping("/adminCheck")
    public boolean adminCheck(HttpServletRequest request) {
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");
      return ideaDB.isAdmin(pidm);
    }

    @PostMapping("/submitIdea")
    public void putIdea(@ModelAttribute Idea idea, HttpServletRequest request) {
      Claims claims = jwtService.decrypt(request);
      idea.setCreatedAt(new Timestamp(System.currentTimeMillis()));
      idea.setCreatedBy((String)claims.get("pidm"));
      ideaDB.addIdea(idea);
    }

    @PostMapping("/flagIdea")
    public void flagIdea(@ModelAttribute Idea idea, HttpServletRequest request) {
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");
      if (ideaDB.isAdmin(pidm)){
        //Flag the idea recording who flagged it and when 
        idea.setFlaggedBy(pidm);
        idea.setFlaggedOn(new Timestamp(System.currentTimeMillis()));
        ideaDB.flagIdea(idea);
      } 
    }
    
    @PostMapping("/archiveIdea")
    public void archiveIdea(@ModelAttribute Idea idea, HttpServletRequest request) {
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");
      if (ideaDB.isAdmin(pidm)){
        //Flag the idea recording who flagged it and when 
        ideaDB.archiveIdea(idea);
      } 
    }

    @PostMapping("/submitVote")
    public void submitVote(@ModelAttribute Vote vote, HttpServletRequest request){
      if (vote.getVoteValue() > 1){
        vote.setVoteValue(1);
      }else if (vote.getVoteValue() < -1 ){
        vote.setVoteValue(-1);
      }
      Claims claims = jwtService.decrypt(request);      
      vote.setVotedAt(new Timestamp(System.currentTimeMillis()));
      vote.setUserPidm((String)claims.get("pidm"));
      ideaDB.submitVote(vote);
    }

    @RequestMapping("/isListEmpty")
    public boolean isListEmpty(){
      return ideaDB.isListEmpty();
    }
}
