package edu.oakland.ideas.v1.service;

import edu.oakland.ideas.v1.model.*;
import edu.oakland.ideas.v1.service.*;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;


@Service
public class IdeaDB implements IIdeaDB {

  @Autowired
  private JdbcTemplate jdbcTemplate;
  
  protected final Log logger = LogFactory.getLog(getClass());

  public List<Idea> getIdeaList(int ideaNumber, String pidm) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        int vote = 0;
        //Vote will be updated from the database. If error occurs, it will remain 0
        try {
          vote = jdbcTemplate.queryForObject("SELECT vote_value from idea_vote where pidm like ? and idea_id = ?",
              new Object[] { pidm, rs.getInt("idea_id") }, Integer.class);
        } catch (Exception e) {
          logger.error(e);
        }
        String category = getCategoryString(rs.getInt("category"));
        Idea idea = new Idea(rs.getInt("idea_id"), rs.getBoolean("approved"), rs.getString("title"),
            rs.getString("description"), rs.getString("created_by"), rs.getTimestamp("created_at"), category,
            rs.getInt("vote_count"), vote);
        idea.setStartVoteDate(rs.getTimestamp("start_vote_date"));
        idea.setEndVoteDate(rs.getTimestamp("end_vote_date"));
        return idea;
      } else {
        return null;
      }
    };

    try{
      return jdbcTemplate.query(Constants.GET_IDEA_LIST, rowMapper, ideaNumber);
    }catch(Error e){
      logger.error(e);
      return null;
    }
  }

  public List<Idea> getUnapprovedIdeas(int ideaNumber) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        String b = getCategoryString(rs.getInt("category"));
        return new Idea(rs.getInt("idea_id"), rs.getString("title"), rs.getString("description"),
            rs.getString("created_by"), rs.getTimestamp("created_at"), b, rs.getInt("vote_count"), 0);
      } else {
        return null;
      }
    };

    try{
      return jdbcTemplate.query(Constants.GET_UNAPPROVED_IDEAS, rowMapper, ideaNumber);
    }catch(Exception e){
      logger.error(e);
      return null;
    }
  }

  //Ideas approved but waiting for their start_vote_date
  public List<Idea> getWaitingIdeas(int ideaNumber) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        String a = getCategoryString(rs.getInt("category"));
        return new Idea(rs.getInt("idea_id"), rs.getString("title"), rs.getString("description"),
            rs.getBoolean("approved"), rs.getString("created_by"), rs.getTimestamp("created_at"),
            rs.getTimestamp("start_vote_date"), rs.getTimestamp("end_vote_date"), 0, a);
      } else {
        return null;
      }
    };

    try{
      return jdbcTemplate.query(Constants.GET_WAITING_IDEAS, rowMapper);
    }catch(Error e){
      logger.error(e);
      return null;
    }
  }

  //Ideas approved but waiting for their start_vote_date
  public List<Idea> getFlaggedIdeas(int ideaNumber) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        String b = getCategoryString(rs.getInt("category"));
        Idea flaggedIdea = new Idea(rs.getInt("idea_id"), rs.getString("title"), rs.getString("description"),
            rs.getString("created_by"), rs.getTimestamp("created_at"), b, rs.getInt("vote_count"), 0);
        flaggedIdea.setFlagged(rs.getBoolean("is_flagged"));
        return flaggedIdea;
      } else {
        return null;
      }
    };

    return jdbcTemplate.query(Constants.GET_FLAGGED_IDEAS,
        rowMapper);
  }

  public List<Idea> getAdminIdeas(int category, int ideaNumber) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        String a = getCategoryString(rs.getInt("category"));
        return new Idea(rs.getInt("idea_id"), rs.getString("title"), rs.getString("description"),
            rs.getString("created_by"), rs.getTimestamp("created_at"), a, rs.getInt("vote_count"), 0);
      } else {
        return null;
      }
    };

    try{
      // TODO: Add a check for dates
      return jdbcTemplate.query(Constants.GET_ADMIN_IDEAS, rowMapper,
          category);

    }catch(Error e){
      logger.error(e);
      return null;
    }
  }

  public List<Idea> getArchiveIdeas(int ideaNumber) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        String a = getCategoryString(rs.getInt("category"));
        return new Idea(rs.getInt("idea_id"), rs.getString("title"), rs.getString("description"),
            rs.getBoolean("approved"), rs.getString("created_by"), rs.getTimestamp("created_at"),
            rs.getTimestamp("start_vote_date"), rs.getTimestamp("end_vote_date"), rs.getInt("vote_count"), a);
      } else {
        return null;
      }
    };

    try{
      return jdbcTemplate.query(Constants.GET_ARCHIVE_IDEAS,
          rowMapper);
    }catch (Error e){
      logger.error(e);
      return null;
    }
  }

  public boolean isAdmin(String pidm) {
    try {
      return jdbcTemplate.queryForObject(Constants.IS_ADMIN,
          new Object[] { pidm }, Boolean.class);
    } catch (Exception e) {
      logger.error(e);
      return false;
    }
  }

  public void editIdea(Idea idea) {
    try{
      jdbcTemplate.update(
          Constants.EDIT_IDEA,
          idea.getTitle(), idea.getDescription(), idea.getCategory(), idea.isApproved(),
          idea.getStartVoteDate(), idea.getEndVoteDate(), idea.getId());
    }catch (Error e){
      logger.error(e);
    }
  }

  public void addIdea(Idea idea) {
    String title = idea.getTitle();
    if (title.length() > 50) {
      title = title.substring(0, 50);
    }

    String description = idea.getDescription();
    if (description.length() > 800) {
      description = description.substring(0, 800);
    }

    try{
      jdbcTemplate.update(
          Constants.ADD_IDEA, title,
          description, idea.getCreatedBy(), idea.getCreatedAt(), getCategoryInt(idea.getCategory()));
    }catch(Error e){
      logger.error(e);
    }
  }

  public void submitVote(Vote vote) {
    HashMap params = new HashMap(3);
    params.put("p_idea", vote.getIdeaID());
    params.put("p_pidm", vote.getUserPidm());
    params.put("p_stuff", vote.getVoteValue());

    SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate).withFunctionName("submit_vote");
    SqlParameterSource voteSQL = new MapSqlParameterSource().addValues(params);

    try {
      call.executeFunction(null, voteSQL);
    }catch(Error e){
      logger.error(e);
    }
  }

  public int getCategoryInt(String cat) {
    try {
      return jdbcTemplate.queryForObject(Constants.CATEGORY_INT,
          new Object[] { cat }, Integer.class);
    }catch(Error e){
      logger.error(e);
      return 0;
    }
  }

  public String getCategoryString(int cid) {
    try{
      String categoryString = jdbcTemplate.queryForObject(Constants.CATEGORY_STRING,
          new Object[] { cid }, String.class);
      return categoryString;
    }catch(Error e){
      logger.error(e);
      return "general";

    }
  }

  public void flagIdea(Idea idea) {
    try{
      jdbcTemplate.update(
          Constants.FLAG_IDEA,
          idea.getFlaggedBy(), idea.getFlaggedOn(), idea.getId());
    }catch(Error e){
      logger.error(e);
    }
  }

  public void archiveIdea(Idea idea) {
    try{
      System.out.println(idea.getId());
      jdbcTemplate.update(Constants.ARCHIVE_IDEA, idea.getId());
    }catch(Error e){
      logger.error(e);
    }
  }


  public boolean isListEmpty(){
    try{
      int count = jdbcTemplate.queryForObject(Constants.IS_LIST_EMPTY, Integer.class);
      if (count > 0){
        return false;
      }    
      return true;
    }catch(Error e){
      logger.error(e);
      return false;
    }
  }
}
