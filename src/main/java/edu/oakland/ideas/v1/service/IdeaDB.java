package edu.oakland.ideas.v1.service;

import edu.oakland.ideas.v1.model.*;
import edu.oakland.ideas.v1.service.*;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

//TODO: Log not into catalina.out


@Service
public class IdeaDB implements IIdeaDB {

  @Autowired
  private JdbcTemplate jdbcTemplate;

  public List<Idea> getIdeaList(int ideaNumber, String pidm) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        int vote = 0;
        //Vote will be updated from the database. If error occurs, it will remain 0
        try {
          vote = jdbcTemplate.queryForObject("SELECT vote_value from idea_vote where pidm like ? and idea_id = ?",
              new Object[] { pidm, rs.getInt("idea_id") }, Integer.class);
        } catch (Exception e) {
          System.out.println(e);
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

    String sql = "SELECT * from idea_post where approved=true and start_vote_date <= now() and end_vote_date >= now() ORDER BY vote_count DESC limit ?";
    try{
      return jdbcTemplate.query(sql, rowMapper, ideaNumber);
    }catch(Error e){
      System.out.println(e);
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
      return jdbcTemplate.query(
          "SELECT * from idea_post where approved=false and is_archived=false and is_flagged=false ORDER BY created_at limit ?",
          rowMapper, ideaNumber);
    }catch(Exception e){
      System.out.println(e);
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
      return jdbcTemplate.query(
          "SELECT * from idea_post where start_vote_date > now() and is_archived=false and approved=true ORDER BY created_at ",
          rowMapper);
    }catch(Error e){
      System.out.println(e);
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

    return jdbcTemplate.query("SELECT * from idea_post where is_flagged=true ORDER BY created_at ",
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
      return jdbcTemplate.query("SELECT * from idea_post where category=? ORDER BY created_at ", rowMapper,
          category);

    }catch(Error e){
      System.out.println(e);
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
      return jdbcTemplate.query("SELECT * from idea_post where is_archived=true or end_vote_date < now() ORDER BY created_at ",
          rowMapper);
    }catch (Error e){
      System.out.println(e);
      return null;
    }
  }

  public boolean isAdmin(String pidm) {
    try {
      return jdbcTemplate.queryForObject("select exists(select 1 from idea_approvers where pidm=?)",
          new Object[] { pidm }, Boolean.class);
    } catch (Exception e) {
      System.out.println(e);
      return false;
    }
  }

  public void editIdea(Idea idea) {
    try{
      jdbcTemplate.update(
          "update idea_post set (title, description, category, approved, start_vote_date, end_vote_date) = (?, ?, (select category_id from idea_categories where category=?), ?, ?, ?) where idea_id=?",
          idea.getTitle(), idea.getDescription(), getCategoryInt(idea.getCategory()), idea.isApproved(),
          idea.getStartVoteDate(), idea.getEndVoteDate(), idea.getId());
    }catch (Error e){
      System.out.println(e);
    }
  }

  public void addIdea(Idea idea) {
    int cat = jdbcTemplate.queryForObject("SELECT category_id from idea_categories where category like ?",
        new Object[] { idea.getCategory() }, Integer.class);

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
          "insert into idea_post (title, description, created_by, created_at, category) values (?, ?, ?, ?, ?)", title,
          description, idea.getCreatedBy(), idea.getCreatedAt(), cat);
    }catch(Error e){
      System.out.println(e);
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
      System.out.println(e);
    }
  }

  public int getCategoryInt(String cat) {
    try {
      return jdbcTemplate.queryForObject("SELECT category_id from idea_categories where category like ?",
          new Object[] { cat }, Integer.class);
    }catch(Error e){
      System.out.println(e);
      return 0;
    }
  }

  public String getCategoryString(int cid) {
    try{
      String categoryString = jdbcTemplate.queryForObject("SELECT category from idea_categories where category_id = ?",
          new Object[] { cid }, String.class);
      return categoryString;
    }catch(Error e){
      System.out.println(e);
      return "general";

    }
  }

  public void flagIdea(Idea idea) {
    try{
      jdbcTemplate.update(
          "update idea_post set (is_flagged, flagged_by, flagged_on, approved) = (true, ?, ?, false) where idea_id=?",
          idea.getFlaggedBy(), idea.getFlaggedOn(), idea.getId());
    }catch(Error e){
      System.out.println(e);
    }
  }

  public void archiveIdea(Idea idea) {
    try{
      jdbcTemplate.update("update idea_post set (is_archived) = (true, ?) where idea_id=?", idea.getId());
    }catch(Error e){
      System.out.println(e);
    }
  }


  public boolean isListEmpty(){
    
    String sql = "SELECT count(*) FROM (SELECT 1 FROM idea_post where approved=true and start_vote_date <= now() and end_vote_date >= now() LIMIT 1) AS t";
    try{
      int count = jdbcTemplate.queryForObject(sql, Integer.class);
      if (count > 0){
        return false;
      }    
      return true;
    }catch(Error e){
      return false;
    }
  }
}
