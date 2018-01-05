package edu.oakland.ideas.v1.service;

import edu.oakland.ideas.v1.model.*;
import edu.oakland.ideas.v1.service.*;

import java.sql.Timestamp;
import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.CallableStatement;
import org.springframework.dao.DataAccessException;
import java.sql.*;
import java.util.HashMap;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import java.sql.Timestamp;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.core.simple.*;
import org.springframework.jdbc.core.namedparam.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.jdbc.core.RowMapper;
import java.util.LinkedList;
import java.util.List;

@Service
public class IdeaDB implements IIdeaDB {
  private Logger log = LoggerFactory.getLogger(IdeaDB.class);

  @Autowired private JdbcTemplate jdbcTemplate;

  public List<Idea> getIdeaList(int ideaNumber, String pidm) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        int vote = 0;
        int id = 0;
        try {
          vote = jdbcTemplate.queryForObject(
              "SELECT vote_value from idea_vote where pidm like ? and idea_id = ?",
              new Object[] {pidm, rs.getInt("idea_id")}, Integer.class);
        } catch (Exception e) {
          System.out.println(e);
        }
        return new Idea(rs.getInt("idea_id"), rs.getBoolean("approved"), rs.getString("title"),
            rs.getString("description"), rs.getString("created_by"), rs.getTimestamp("created_at"),
            rs.getString("category"), rs.getInt("vote_count"), vote);
      } else {
        return null;
      }
    };

    // TODO: Add a check for dates
    String sql =
        "SELECT * from idea_post where approved=true and start_vote_date <= now() and end_vote_date >= now() ORDER BY vote_count DESC limit ?";
    List<Idea> list = jdbcTemplate.query(sql, rowMapper, ideaNumber);
    return list;
  }

  public List<Idea> getUnapprovedIdeas(int ideaNumber) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        return new Idea(rs.getInt("idea_id"), rs.getString("title"), rs.getString("description"),
            rs.getString("created_by"), rs.getTimestamp("created_at"), rs.getInt("category"),
            rs.getInt("vote_count"), 0);
      } else {
        return null;
      }
    };

    // TODO: Add a check for dates

    List<Idea> list = jdbcTemplate.query(
        "SELECT * from idea_post where approved=false and is_archived=false and is_flagged=false ORDER BY created_at ",
        rowMapper);
    return list;
  }

  public List<Idea> getWaitingIdeas(int ideaNumber) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        return new Idea(rs.getInt("idea_id"), rs.getBoolean("approved"), rs.getString("title"),
            rs.getString("description"), rs.getString("created_by"), rs.getTimestamp("created_at"),
            rs.getString("category"), rs.getInt("vote_count"), 0);
      } else {
        return null;
      }
    };

    // TODO: Add a check for dates
    List<Idea> list = jdbcTemplate.query(
        "SELECT * from idea_post where start_vote_date > now() and is_archived=false and approved=true ORDER BY created_at ",
        rowMapper);
    return list;
  }

  public List<Idea> getAdminIdeas(int category, int ideaNumber) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        return new Idea(rs.getInt("idea_id"), rs.getString("title"), rs.getString("description"),
            rs.getString("created_by"), rs.getTimestamp("created_at"), rs.getString("category"),
            rs.getInt("vote_count"), 0);
      } else {
        return null;
      }
    };

    // TODO: Add a check for dates

    List<Idea> list = jdbcTemplate.query(
        "SELECT * from idea_post where category=? ORDER BY created_at ", rowMapper, category);
    return list;
  }

  public List<Idea> getArchiveIdeas(int ideaNumber) {
    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rowNum < ideaNumber) {
        return new Idea(rs.getInt("idea_id"), rs.getString("title"), rs.getString("description"),
            rs.getBoolean("approved"), rs.getString("created_by"), rs.getTimestamp("created_at"),
            rs.getTimestamp("start_vote_date"), rs.getTimestamp("end_vote_date"),
            rs.getInt("vote_count"), rs.getString("category"));
      } else {
        return null;
      }
    };

    // TODO: Add a check for dates

    List<Idea> list = jdbcTemplate.query(
        "SELECT * from idea_post where is_archived=true ORDER BY created_at ", rowMapper);
    return list;
  }

  public boolean isAdmin(String pidm) {
    try {
      return jdbcTemplate.queryForObject("select exists(select 1 from idea_approvers where pidm=?)",
          new Object[] {pidm}, Boolean.class);
    } catch (Exception e) {
      System.out.println(e);
      return false;
    }
  }

  public void editIdea(Idea idea) {
    jdbcTemplate.update(
        "update idea_post set (title, description, category, approved, start_vote_date, end_vote_date) = (?, ?, ?, ?, ?, ?) where idea_id=?",
        idea.getTitle(), idea.getDescription(), Integer.parseInt(idea.getCategory()),
        idea.isApproved(), idea.getStartVoteDate(), idea.getEndVoteDate(), idea.getId());
  }

  public void addIdea(Idea idea) {
    int cat =
        jdbcTemplate.queryForObject("SELECT category_id from idea_categories where category like ?",
            new Object[] {idea.getCategory()}, Integer.class);
    jdbcTemplate.update(
        "insert into idea_post (title, description, created_by, created_at, category) values (?, ?, ?, ?, ?)",
        idea.getTitle(), idea.getDescription(), idea.getCreatedBy(), idea.getCreatedAt(), cat);
  }

  public void submitVote(Vote vote) {
    HashMap params = new HashMap(3);
    params.put("p_idea", vote.getIdeaID());
    params.put("p_pidm", vote.getUserPidm());
    params.put("p_stuff", vote.getVoteValue());

    SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate).withFunctionName("submit_vote");
    SqlParameterSource voteSQL = new MapSqlParameterSource().addValues(params);

    call.executeFunction(null, voteSQL);
  }

  public void logForAdmin(String description, String ideaID, String pidm, Timestamp time) {
    jdbcTemplate.update(
        "insert into idea_flagged (idea_id, description, pidm, time) values (?, ?, ?, ?)", ideaID,
        description, pidm, time);
  }
}
