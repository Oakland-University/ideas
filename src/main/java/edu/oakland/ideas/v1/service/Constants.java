package edu.oakland.ideas.v1.service;

public class Constants{

   public static final String GET_TEST_IDEA = "select * from idea_post where category=1;";

   public static final String GET_IDEA_LIST = 
     " SELECT * " +
     "  from idea_post " + 
     "    left outer join idea_vote on idea_post.idea_id = idea_vote.idea_id " + 
     "  where approved = true and is_archived = false and start_vote_date <= now() and end_vote_date >= now() " + 
     "  ORDER BY vote_count DESC " + 
     "  limit ? ";

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

   public static final String GET_ARCHIVE_IDEAS = 
   " SELECT * " +
   " FROM idea_post " +
   " WHERE is_archived = TRUE OR end_vote_date < now() " +
   " ORDER BY created_at";

   public static final String IS_ADMIN = 
   " SELECT exists(SELECT 1 " +
   "  FROM idea_approvers " +
   "  WHERE pidm = ?) " ;

   public static final String EDIT_IDEA = 
   " UPDATE idea_post " +
   " SET (title, description, category, approved, start_vote_date, end_vote_date) = " +
   "      (?, ?, (SELECT category_id FROM idea_categories WHERE category = ?), ?, ?, ?) " +
   " WHERE idea_id =? " ;

   public static final String ADD_IDEA = 
   " insert into idea_post (title, description, created_by, created_at, category) values (?, ?, ?, ?, ?)";

   public static final String CATEGORY_INT = 
   " SELECT category_id " +
   " FROM idea_categories " +
   " WHERE category = ? ";

   public static final String CATEGORY_STRING = 
   " SELECT category " +
   " FROM idea_categories " +
   " WHERE category_id = ? ";

   public static final String FLAG_IDEA = 
   " UPDATE idea_post " +
   " SET (is_flagged, flagged_by, flagged_on, approved, is_archived) = (TRUE, ?, ?, FALSE, FALSE) " +
   " WHERE idea_id =?; ";
   
   public static final String ARCHIVE_IDEA = 
   "update idea_post set is_archived = true, approved = false where idea_id=?";

   public static final String IS_LIST_EMPTY = 
   "SELECT 1 " + 
   "  FROM idea_post " + 
   "  WHERE approved = TRUE AND start_vote_date <= now() AND end_vote_date >= now() " + 
   "  LIMIT 1"; 

}
