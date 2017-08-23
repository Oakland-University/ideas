package edu.oakland.ideas.v1.api;
import java.util.LinkedList;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import edu.oakland.ideas.v1.model.Idea;
import edu.oakland.ideas.v1.service.*;
import java.util.List;


@RestController
@RequestMapping("/api/v1")
public class ApiV1 {

    @Autowired IIdeaDB ideaDB;

    @RequestMapping("/getList")
    public List<Idea> idea(){
      return ideaDB.getIdeaList(5); 
    }

}
