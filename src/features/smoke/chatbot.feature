Feature: Login to keepme application 

@regression @smoke @controlcentre
Scenario: Chatbot booking flow
  Given user navigates to the keepme application
  And user logs in to keepme Dashboard with valid credentials
  Then user search for client
  And user select client from table  
  And user waits for 5 seconds
  And user select location 
  And user waits for 5 seconds

  Given user opens the chatbot  
  When user completes conversation flow
  Then booking should be confirmed
 


