Feature: Login to keepme application 

@regression @smoke 
Scenario: Login to keepme application
  Given user navigates to the keepme application
  And user logs in to keepme Dashboard with valid credentials
  Then user search for client
  And user select client from table  
  And user waits for 5 seconds
  And user select location 
  And user waits for 5 seconds

  Given user opens the webchatbot
  And user waits for 5 seconds
  When user sends message for booking "I would like to book a tour "
  And user waits for 10 seconds
  When user sends message for lead name "here is my name "
  And user waits for 10 seconds
  When user sends message for email and phone number "This is my email and phone number"
  And user waits for 12 seconds
  Then bot should respond
  And user waits for 12 seconds
  Then verify bot response for booking confirmation  

@KeepmeCRM @smoke 
Scenario: Login to keepme CRM application
  Given user navigates to the CRM application
  And user logs in to CRM with valid credentials 
  And user waits for 10 seconds keepme   
  And user clicks on switchToSales
  And user waits for 10 seconds keepme
  And user clicks on Leads
  And user waits for 5 seconds keepme
  And user search for lead name
  And user waits for 10 seconds keepme
  And user clicks on new created Lead
  And user waits for 10 seconds keepme
  Then verify lead status
  Then verify outcome status
  And user waits for 10 seconds keepme

@PerfectgymCRM @smoke 
Scenario: Login to perfectgym CRM application
  Given user navigates to the perfectgym CRM application
  And user logs in to perfectgym CRM with valid credentials
  And user waits for 10 seconds PG
  And user switch to CRM in perfectgym
  And user waits for 10 seconds PG
  And user click on Leads tab in perfectgym
  And user waits for 10 seconds PG
  And user clicks on active Lead tab in perfectgym
  And user waits for 10 seconds PG
  And user search for new created Lead in perfectgym
  And user waits for 12 seconds PG
  And verify lead status in perfectgym

@KeepmeAPI @smoke
Scenario: Login to keepme API
  Given user navigates to the Keepme CRM application
  And user logs in to Keepme CRM via API
  Then lead should exist in Keepme CRM via API
  
@PerfectgymAPI @smoke  
Scenario: Verify perfectgym API
  Given user logs in to Perfectgym CRM via API
  Then lead should exist in Perfectgym CRM via API  
