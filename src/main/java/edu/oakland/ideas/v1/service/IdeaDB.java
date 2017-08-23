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
        return new Idea(rs.getString("title"), rs.getString("description"), rs.getString("created_by"), rs.getTimestamp("created_at"), rs.getInt("category"));
      }else{
        return null;
      }
    };

    List<Idea> stuff = jdbcTemplate.query("SELECT * from idea_post where category=1;", rowMapper);
    return stuff;

  }
}

