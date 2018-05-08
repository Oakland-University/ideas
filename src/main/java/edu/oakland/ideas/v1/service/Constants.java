package edu.oakland.ideas.v1.service;

public class Constants{

   public static final String GET_TEST_IDEA = "select * from idea_post where category=1;";

   public static final String GET_IDEA_LIST = 
   "SELECT * from idea_post where" +
   "  approved=true and start_vote_date <= now() and end_vote_date >= now()" + 
   "  ORDER BY vote_count DESC limit ?";

   public static final String GET_UNAPPROVED_IDEAS = 
   "SELECT * from idea_post where" + 
   "  approved=false and is_archived=false and is_flagged=false " + 
   "  ORDER BY created_at limit ?";

   public static final String GET_WAITING_IDEAS = 
   "SELECT * from idea_post where " + 
   "  start_vote_date > now() and is_archived=false and approved=true " + 
   "  ORDER BY created_at ";

   public static final String GET_FLAGGED_IDEAS = 
   "SELECT * from idea_post where " + 
   "  is_flagged=true ORDER BY created_at ";

   public static final String GET_ADMIN_IDEAS = 
   "SELECT * from idea_post where " +
   "  category=? ORDER BY created_at ";

}
