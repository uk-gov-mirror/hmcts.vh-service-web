﻿Feature: Thank You
	As a Participant
	I want to be able to reach end of the questionnaire 
	And also answer all the self test questions
	So that I can join a video hearing

@Smoketest
Scenario: Thank You Individual
	Given the Individual has progressed to the Thank You page
	Then contact details are available
	And the hearing date is displayed correctly
	And answers have been stored