﻿using ServiceWebsite.AcceptanceTests.Helpers;
using ServiceWebsite.AcceptanceTests.Pages;
using TechTalk.SpecFlow;

namespace ServiceWebsite.AcceptanceTests.Steps
{
    [Binding]
    public sealed class IndividualQuestionnaireJourney
    {
        private readonly DecisionJourney _aboutYou;
        private readonly ErrorMessage _errorMessage;
        private DecisionJourney _currentPage;
        private readonly DecisionJourney _interpreter;
        private readonly DecisionJourney _yourComputer;
        private readonly Page _thankYou;
        private readonly DecisionJourney _aboutYourComputer;
        private readonly InformationSteps _information;
        private bool Answer;
        public IndividualQuestionnaireJourney(BrowserContext browserContext, ErrorMessage errorMessage, InformationSteps information)
        {
            _aboutYou = new DecisionJourney(browserContext, PageUri.AboutYouPage);
            _interpreter = new DecisionJourney(browserContext, PageUri.InterpreterPage);
            _errorMessage = errorMessage;
            _yourComputer = new DecisionJourney(browserContext, PageUri.YourComputerPage);
            _thankYou = new Page(browserContext, PageUri.ThankYouPage);
            _aboutYourComputer = new DecisionJourney(browserContext, PageUri.AboutYourComputerPage);
            _information = information;
        }
        [Given(@"'(.*)' participant is on '(.*)' page")]
        public void GivenIndividualParticipantIsOnPage(string participant, string page)
        {
            _information.InformationScreen(participant);
            switch (page)
            {
                case "about you":
                    _aboutYou.Validate();
                    _currentPage = _aboutYou;
                    break;
                case "interpreter":
                    NavigateToDecisionPage(_aboutYou);
                    _currentPage = _interpreter;
                    break;
                case "your computer":
                    NavigateToDecisionPage(_aboutYou);
                    NavigateToDecisionPage(_interpreter);
                    _currentPage = _yourComputer;
                    break;
            }
        }

        [Then(@"(.*) error should be displayed")]
        [Then(@"(.*) errors should be displayed")]
        public void ThenAnErrorMessageShouldBeDisplayed(int errorCounter)
        {
            _errorMessage.ValidateErrorMessage(errorCounter);
        }

        [Then(@"Participant should proceed to about you page")]
        public void ThenParticipantShouldProceedToAboutYouPage()
        {
            _aboutYou.Validate();
        }

        [When(@"Individual provides answer as yes")]
        public void WhenIndividualProvidesAnswerAsYes()
        {
            _currentPage.SelectYes();
        }

        [When(@"Individual attempts to proceed without selecting an answer")]
        [When(@"Individual proceeds to next page")]
        [When(@"Individual attempts to proceed without providing additional information")]
        public void WhenIndividualAttemptsToProceedWithoutProvidingAdditionalInformation()
        {
            _currentPage.Continue();
        }

        [When(@"Individual provides additional information '(.*)'")]
        [When(@"Individual provides additional information containing a two character length '(.*)'")]
        public void WhenIndividualProvidesAdditionalInformationContainingLessThanCharacters(string detail)
        {
            _aboutYou.SelectYes(detail);
        }

        [When(@"Individual provides answer as no")]
        public void WhenIndividualProvidesAnswerAsNo()
        {
            _currentPage.SelectNo();
            Answer = false;
        }
        [Then(@"Individual should be on '(.*)' screen")]
        public void ThenParticipantShouldProceedToPage(string page)
        {
            switch (page)
            {
                case "about you": _aboutYou.Validate();
                    break;
                case "interpreter": _interpreter.Validate();
                    break;
                case "your computer": _yourComputer.Validate();
                    break;
                case "thank you":
                    if (!Answer)
                    {
                        _thankYou.Validate();
                    }
                    break;
                case "about your computer": _aboutYourComputer.Validate();
                    break;
            }
        }
        private void NavigateToDecisionPage(DecisionJourney decisionJourneyPage)
        {
            if (decisionJourneyPage == _yourComputer)
            {
                decisionJourneyPage.Validate();
                decisionJourneyPage.SelectYes();
            }
            else
            {
                decisionJourneyPage.Validate();
                decisionJourneyPage.SelectNo();
            }            
            decisionJourneyPage.Continue();
        }
    }
}