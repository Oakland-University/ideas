package edu.oakland.ideas.controller;

import edu.oakland.ideas.model.Idea;
import edu.oakland.ideas.model.Vote;
import edu.oakland.ideas.service.*;
import edu.oakland.soffit.auth.AuthService;
import edu.oakland.soffit.auth.SoffitAuthException;

import java.sql.Timestamp;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1")
public class IdeaController {

  @Autowired IIdeaDB ideaDB;

  @Autowired AuthService authorizer;

  protected final Log logger = LogFactory.getLog(getClass());

  @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Illegal Arguments given")
  @ExceptionHandler({IllegalArgumentException.class, DataAccessException.class})
  public void illegalArgumentError(Exception e) {
    logger.error("Throwing Illegal Argument or Data Access error");
    logger.error("", e);
  }

  @ResponseStatus(value = HttpStatus.UNAUTHORIZED, reason = "Invlaid JWT")
  @ExceptionHandler(SoffitAuthException.class)
  public void soffitError(SoffitAuthException e) {
    logger.error("Invalid JWT");
    logger.error("", e);
  }

  @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR, reason = "Unspecified exception")
  @ExceptionHandler(Exception.class)
  public void generalError(Exception e) {
    logger.error("Unspecified exception");
    logger.error("", e);
  }

  @GetMapping("list")
  @ResponseStatus(HttpStatus.OK)
  public List<Idea> idea(
      @RequestParam(value = "ideaLimit", required = false, defaultValue = "5") int ideaLimit)
      throws SoffitAuthException {

    if (ideaLimit < 1) {
      ideaLimit = 5;
    }

    return ideaDB.getIdeaList(ideaLimit);
  }

  @GetMapping("unapproved")
  public List<Idea> getUnapprovedIdeas(
      @RequestParam(value = "ideaLimit", required = false, defaultValue = "50") int ideaLimit,
      HttpServletRequest request)
      throws SoffitAuthException {

    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();

    if (ideaDB.isAdmin(pidm)) {
      return ideaDB.getUnapprovedIdeas(ideaLimit);
    } else {
      throw new IllegalArgumentException();
    }
  }

  @GetMapping("waiting")
  public List<Idea> getWaitingIdeas(
      @RequestParam(value = "ideaLimit", required = false, defaultValue = "5") int ideaLimit,
      HttpServletRequest request)
      throws SoffitAuthException {
    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();

    if (ideaDB.isAdmin(pidm)) {
      return ideaDB.getWaitingIdeas(ideaLimit);
    } else {
      throw new IllegalArgumentException();
    }
  }

  @GetMapping("archive")
  public List<Idea> getArchive(
      @RequestParam(value = "ideaLimit", required = false, defaultValue = "10") int ideaLimit,
      HttpServletRequest request)
      throws SoffitAuthException {
    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();

    if (ideaDB.isAdmin(pidm)) {
      return ideaDB.getArchiveIdeas(ideaLimit);
    } else {
      throw new IllegalArgumentException();
    }
  }

  @GetMapping("flagged")
  public List<Idea> getFlagged(
      @RequestParam(value = "ideaLimit", required = false, defaultValue = "10") int ideaLimit,
      HttpServletRequest request)
      throws SoffitAuthException {
    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();

    if (ideaDB.isAdmin(pidm)) {
      return ideaDB.getFlaggedIdeas(ideaLimit);
    } else {
      throw new IllegalArgumentException();
    }
  }

  @PostMapping("editIdea")
  public ResponseEntity<Void> editIdea(
      @Valid Idea idea, BindingResult bindingResult, HttpServletRequest request)
      throws SoffitAuthException {
    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();

    if (bindingResult.hasErrors()) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    if (ideaDB.isAdmin(pidm)) {
      try {
        ideaDB.editIdea(idea);
        return new ResponseEntity<>(HttpStatus.OK);
      } catch (DataAccessException e) {
        logger.error(e);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      logger.error("NOT AN ADMIN: \t" + pidm);
      return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
  }

  @GetMapping("is-admin")
  public boolean adminCheck(HttpServletRequest request) throws SoffitAuthException {
    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();
    return ideaDB.isAdmin(pidm);
  }

  @PostMapping("idea")
  public ResponseEntity<Void> putIdea(
      @Valid Idea idea, BindingResult bindingResult, HttpServletRequest request)
      throws SoffitAuthException {
    if (bindingResult.hasErrors()) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();
    idea.setCreatedAt(new Timestamp(System.currentTimeMillis()));
    idea.setCreatedBy(pidm);

    try {
      ideaDB.addIdea(idea);
      return new ResponseEntity<>(HttpStatus.CREATED);
    } catch (DataAccessException e) {
      logger.error(e);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("flag")
  @ResponseStatus(HttpStatus.OK)
  public void flagIdea(@ModelAttribute Idea idea, HttpServletRequest request)
      throws SoffitAuthException {
    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();
    if (ideaDB.isAdmin(pidm)) {
      // Flag the idea recording who flagged it and when
      idea.setFlaggedBy(pidm);
      idea.setFlaggedOn(new Timestamp(System.currentTimeMillis()));
      ideaDB.flagIdea(idea);
      return;
    }
    throw new IllegalArgumentException();
  }

  @PostMapping("archive")
  @ResponseStatus(HttpStatus.OK)
  public void archiveIdea(@ModelAttribute Idea idea, HttpServletRequest request)
      throws SoffitAuthException {
    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();
    if (ideaDB.isAdmin(pidm)) {
      ideaDB.archiveIdea(idea);
      return;
    }
    throw new IllegalArgumentException();
  }

  @PostMapping("vote")
  @ResponseStatus(HttpStatus.CREATED)
  public void submitVote(@ModelAttribute Vote vote, HttpServletRequest request)
      throws SoffitAuthException {
    if (vote.getVoteValue() > 1) {
      vote.setVoteValue(1);
    } else if (vote.getVoteValue() < -1) {
      vote.setVoteValue(-1);
    }

    String pidm = authorizer.getClaimFromJWE(request, "pidm").asString();
    vote.setVotedAt(new Timestamp(System.currentTimeMillis()));
    vote.setUserPidm(pidm);

    ideaDB.submitVote(vote);
  }

  @GetMapping("is-empty")
  public boolean isListEmpty() {
    return ideaDB.isListEmpty();
  }
}
