package edu.oakland.ideas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.RestController;
import io.jsonwebtoken.Claims;

import edu.oakland.ideas.model.Idea;
import edu.oakland.ideas.model.Vote;
import edu.oakland.ideas.service.*;
import edu.oakland.jwtservice.IJwtService;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.validation.Valid;

import org.springframework.validation.BindingResult;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin
@RestController
@RequestMapping("/api/v1")
public class IdeaController {

    @Autowired IIdeaDB ideaDB;

    @Autowired IJwtService jwtService;
    
    protected final Log logger = LogFactory.getLog(getClass());

    @RequestMapping("/getList")
    public ResponseEntity<List<Idea>> idea(@RequestParam(value = "ideaLimit", required = false, defaultValue = "5") int ideaLimit, HttpServletRequest request) {
        Claims claims = jwtService.decrypt(request);
        String pidm = (String) claims.get("pidm");

        if (ideaLimit < 1) {
          ideaLimit = 5;
        }

        try {
          return new ResponseEntity<>(ideaDB.getIdeaList(ideaLimit, pidm), HttpStatus.OK);
        }catch (DataAccessException e){
          logger.error(e);
          return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping("/getUnapprovedIdeas")
    public ResponseEntity<List<Idea>> getUnapprovedIdeas(@RequestParam(value = "ideaLimit", required = false, defaultValue = "50") int ideaLimit, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (ideaDB.isAdmin(pidm)){
        try{
          return new ResponseEntity<>(ideaDB.getUnapprovedIdeas(ideaLimit), HttpStatus.OK);
        }catch (DataAccessException e){
          logger.error(e);
          return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
      }

    }

    @RequestMapping("/getWaitingIdeas")
    public ResponseEntity<List<Idea>> getWaitingIdeas(@RequestParam(value = "ideaLimit", required = false, defaultValue = "5") int ideaLimit, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (ideaDB.isAdmin(pidm)){
        try{
          return new ResponseEntity<>(ideaDB.getWaitingIdeas(ideaLimit), HttpStatus.OK);
        }catch (DataAccessException e){
          logger.error(e);
          return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
      }

    }

    @RequestMapping("/getArchive")
    public ResponseEntity<List<Idea>> getArchive(@RequestParam(value = "ideaLimit", required = false, defaultValue = "10") int ideaLimit, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (ideaDB.isAdmin(pidm)){
        try{
          return new ResponseEntity<>(ideaDB.getArchiveIdeas(ideaLimit), HttpStatus.OK);
        }catch (DataAccessException e){
          logger.error(e);
          return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
      }
    }

    @RequestMapping("/getFlagged")
    public ResponseEntity<List<Idea>> getFlagged(@RequestParam(value = "ideaLimit", required = false, defaultValue = "10") int ideaLimit, HttpServletRequest request){
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (ideaDB.isAdmin(pidm)){
        try{
          return new ResponseEntity<>(ideaDB.getFlaggedIdeas(ideaLimit), HttpStatus.OK);
        }catch (DataAccessException e){
          logger.error(e);
          return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
      }
    }

    @PostMapping("/editIdea")
    public ResponseEntity<Void> editIdea(@Valid Idea idea, BindingResult bindingResult, HttpServletRequest request) {
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");

      if (bindingResult.hasErrors()) {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
      }

      if (ideaDB.isAdmin(pidm)){
        try {
          ideaDB.editIdea(idea);
          return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataAccessException e) {
          logger.error(e);
          return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }else{
        logger.error("NOT AN ADMIN: \t" + pidm);
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }
    }

    @RequestMapping("/adminCheck")
    public boolean adminCheck(HttpServletRequest request) {
      System.out.println(request);
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

      try{
        ideaDB.addIdea(idea);
        return new ResponseEntity<>(HttpStatus.CREATED);
      }catch(DataAccessException e){
        logger.error(e);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
      }
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
        try{
          return new ResponseEntity<>(HttpStatus.OK);
        }catch (DataAccessException e){
          logger.error(e);
          return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } 
      return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
    
    @PostMapping("/archiveIdea")
    public ResponseEntity<Void> archiveIdea(@ModelAttribute Idea idea, HttpServletRequest request) {
      Claims claims = jwtService.decrypt(request);
      String pidm = (String) claims.get("pidm");
      if (ideaDB.isAdmin(pidm)){
        //Flag the idea recording who flagged it and when 
        try{
          ideaDB.archiveIdea(idea);
          return new ResponseEntity<>(HttpStatus.OK);
        }catch (DataAccessException e){
          logger.error(e);
          return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } 
      return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/submitVote")
    public ResponseEntity<Void> submitVote(@ModelAttribute Vote vote, HttpServletRequest request){
      if (vote.getVoteValue() > 1){
        vote.setVoteValue(1);
      }else if (vote.getVoteValue() < -1 ){
        vote.setVoteValue(-1);
      }
      Claims claims = jwtService.decrypt(request);      
      vote.setVotedAt(new Timestamp(System.currentTimeMillis()));
      vote.setUserPidm((String)claims.get("pidm"));

      try{
        ideaDB.submitVote(vote);
        return new ResponseEntity<>(HttpStatus.CREATED);
      }catch (DataAccessException e){
        logger.error(e);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @RequestMapping("/isListEmpty")
    public boolean isListEmpty(){
      return ideaDB.isListEmpty();
    }
}
