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

  @Autowired
  private JdbcTemplate jdbcTemplate;


  @Resource(name = "dataSource")
  public void setDataSource(DataSource dataSource) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
  }

  public void getIdea(){
  }


  public List<Idea> getIdeaList(int ideaNumber, String pidm){

    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if ( rowNum < ideaNumber ){
        int vote = 0;
        int id = 0;
        try {
          //TODO: Add idea)id
          vote = jdbcTemplate.queryForObject("SELECT idea_id from idea_vote where pidm like ?", new Object[] {pidm}, Integer.class);   
        }catch(Exception e){
          System.out.println(e);
        }
        return new Idea(rs.getInt("idea_id"), rs.getString("title"), rs.getString("description"), rs.getString("created_by"), rs.getTimestamp("created_at"), rs.getString("category"), vote);
      }else{
        return null;
      }
    };

    List<Idea> stuff = jdbcTemplate.query("SELECT * from idea_post where category=1 limit ?", rowMapper, ideaNumber);
    return stuff;

  }


  //public List<Idea> getIdeaList(int ideaNumber, String pidm, String category){

  //  RowMapper<Idea> rowMapper = (rs, rowNum) -> {
  //    if (rs.getString("category").equals(category)){
  //      if ( rowNum < ideaNumber ){
  //        return new Idea(rs.getString("title"), rs.getString("description"), rs.getString("created_by"), rs.getTimestamp("created_at"), rs.getString("category"), 0);
  //      }else{
  //        return null;
  //      }
  //    }else{
  //      return null;
  //    }
  //  };

  //  List<Idea> stuff = jdbcTemplate.query("SELECT * from idea_post where category=1;", rowMapper);
  //  return stuff;

  //}


  public void addIdea(Idea idea){
    jdbcTemplate.update("insert into idea_post (title, description, created_by, created_at, category) values (?, ?, ?, ?, (select category_id from idea_categories where category='test'))", 
        idea.getTitle(), idea.getDescription(), idea.getCreatedBy(), idea.getCreatedAt());
  }

  public int getCategoryInt(String cat){
    int thing = jdbcTemplate.queryForObject("SELECT id from idea_category where name like ?", new Object[] { cat }, Integer.class);   
    return thing;
  }

  public void submitVote(Vote vote){

    HashMap params = new HashMap(3);
    params.put("p_idea", vote.getIdeaID());
    params.put("p_pidm", vote.getUserPidm());
    params.put("p_stuff", vote.getVoteValue());

    SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate).withFunctionName("submit_vote");
    SqlParameterSource voteSQL = new MapSqlParameterSource().addValues(params);

    call.executeFunction(null, voteSQL);

  }

  public void logForAdmin(String description, String ideaID, String pidm, Timestamp time){
    jdbcTemplate.update("insert into idea_flagged (idea_id, description, pidm, time) values (?, ?, ?, ?)", ideaID, description, pidm, time);
  }

}