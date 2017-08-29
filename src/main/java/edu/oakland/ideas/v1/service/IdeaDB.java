package edu.oakland.ideas.v1.service;

import edu.oakland.ideas.v1.model.*;
import edu.oakland.ideas.v1.service.*;


import java.sql.Timestamp;
import javax.annotation.Resource;
import javax.sql.DataSource;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;

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
    System.out.println("Hello world");
  }


  public List<Idea> getIdeaList(int ideaNumber){

    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if ( rowNum < ideaNumber ){
        return new Idea(rs.getString("title"), rs.getString("description"), rs.getString("created_by"), rs.getTimestamp("created_at"), rs.getString("category"));
      }else{
        return null;
      }
    };

    List<Idea> stuff = jdbcTemplate.query("SELECT * from idea_post where category=1;", rowMapper);
    return stuff;

  }


  public List<Idea> getIdeaList(int ideaNumber, String category){

    RowMapper<Idea> rowMapper = (rs, rowNum) -> {
      if (rs.getString("category").equals(category)){
        if ( rowNum < ideaNumber ){
          return new Idea(rs.getString("title"), rs.getString("description"), rs.getString("created_by"), rs.getTimestamp("created_at"), rs.getString("category"));
        }else{
          return null;
        }
      }else{
        return null;
      }
    };

    List<Idea> stuff = jdbcTemplate.query("SELECT * from idea_post where category=1;", rowMapper);
    return stuff;

  }


  public void addIdea(Idea idea){
    jdbcTemplate.update("insert into idea_post (title, description, created_by, created_at, category) values (?, ?, ?, ?, (select category_id from idea_categories where category='test'))", 
        idea.getTitle(), idea.getDescription(), idea.getCreatedBy(), idea.getCreatedAt());
  }

  public int getCategoryInt(String cat){
    int thing = jdbcTemplate.queryForObject("SELECT id from idea_category where name like ?", new Object[] { cat }, Integer.class);   
    return thing;
  }
}

