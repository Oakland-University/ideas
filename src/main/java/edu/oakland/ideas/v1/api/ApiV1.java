package edu.oakland.ideas.v1.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.jsonwebtoken.Claims;

import edu.oakland.ideas.v1.model.Idea;
import edu.oakland.ideas.v1.model.Vote;
import edu.oakland.ideas.v1.service.*;
import edu.oakland.jwtservice.IJwtService;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import javax.validation.Valid;

import org.springframework.validation.BindingResult;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin
@RestController
@RequestMapping("/api/v1")
public class ApiV1 {

    @Autowired IIdeaDB ideaDB;

    @Autowired IJwtService jwtService;

    @RequestMapping("/getList")
    public ResponseEntity<List<Idea>> idea(@RequestParam(value = "ideaLimit", required = false, defaultValue = "5") int ideaLimit, HttpServletRequest request) {
        Claims claims = jwtService.decrypt(request);
        String pidm = (String) claims.get("pidm");
        if (ideaLimit < 1) {
          return new ResponseEntity<>(ideaDB.getIdeaList(5, pidm), HttpStatus.OK);
        }
        return new ResponseEntity<>(ideaDB.getIdeaList(ideaLimit, pidm), HttpStatus.OK);
    }

    @RequestMapping("/getUnapprovedIdeas")
    public ResponseEntity<List<Idea>> getUnapprovedIdeas(@RequestParam(value = "i", required = false, defaultValue = "50") int i, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (ideaDB.isAdmin(pidm)){
        return new ResponseEntity<>(ideaDB.getUnapprovedIdeas(i), HttpStatus.OK);
      } else {
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
      }

    }

    @RequestMapping("/getWaitingIdeas")
    public ResponseEntity<List<Idea>> getWaitingIdeas(@RequestParam(value = "i", required = false, defaultValue = "5") int i, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");


      if (ideaDB.isAdmin(pidm)){
        return new ResponseEntity<>(ideaDB.getWaitingIdeas(i), HttpStatus.OK);
      } else {
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
      }

    }

    @RequestMapping("/getArchive")
    public ResponseEntity<List<Idea>> getArchive(@RequestParam(value = "i", required = false, defaultValue = "10") int i, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (ideaDB.isAdmin(pidm)){
        return new ResponseEntity<>(ideaDB.getArchiveIdeas(i), HttpStatus.OK);
      } else {
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
      }
    }

    @RequestMapping("/getFlagged")
    public ResponseEntity<List<Idea>> getFlagged(@RequestParam(value = "i", required = false, defaultValue = "10") int i, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (ideaDB.isAdmin(pidm)){
        return new ResponseEntity<>(ideaDB.getFlaggedIdeas(i), HttpStatus.OK);
      } else {
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
      }
    }

    @PostMapping("/editIdea")
    public ResponseEntity<Void> editIdea(@Valid Idea idea, BindingResult bindingResult, HttpServletRequest request) {
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (bindingResult.hasErrors()) {
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      if (ideaDB.isAdmin(pidm)){
        ideaDB.editIdea(idea);
        return new ResponseEntity<>(HttpStatus.OK);
      }else{
        //LOG IT
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }
    }

    @RequestMapping("/adminCheck")
    public boolean adminCheck(HttpServletRequest request) {
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");
      return ideaDB.isAdmin(pidm);
    }

    @PostMapping("/submitIdea")
    public ResponseEntity<Void> putIdea(@Valid Idea idea, BindingResult bindingResult, HttpServletRequest request) {
      if (bindingResult.hasErrors()) {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
      }
      Claims claims = jwtService.decrypt(request);
      idea.setCreatedAt(new Timestamp(System.currentTimeMillis()));
      idea.setCreatedBy((String)claims.get("pidm"));
      ideaDB.addIdea(idea);
      return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/flagIdea")
    public ResponseEntity<Void> flagIdea(@ModelAttribute Idea idea, HttpServletRequest request) {
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");
      if (ideaDB.isAdmin(pidm)){
        //Flag the idea recording who flagged it and when 
        idea.setFlaggedBy(pidm);
        idea.setFlaggedOn(new Timestamp(System.currentTimeMillis()));
        ideaDB.flagIdea(idea);
        return new ResponseEntity<>(HttpStatus.OK);
      } 
      return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
    
    @PostMapping("/archiveIdea")
    public ResponseEntity<Void> archiveIdea(@ModelAttribute Idea idea, HttpServletRequest request) {
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");
      if (ideaDB.isAdmin(pidm)){
        //Flag the idea recording who flagged it and when 
        ideaDB.archiveIdea(idea);
        return new ResponseEntity<>(HttpStatus.OK);
      } 
      return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
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
