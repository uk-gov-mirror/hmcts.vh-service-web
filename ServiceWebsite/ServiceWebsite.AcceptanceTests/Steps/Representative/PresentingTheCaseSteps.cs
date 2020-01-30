﻿using System.Collections.Generic;
using AcceptanceTests.Common.Data.Questions;
using AcceptanceTests.Common.Driver.Browser;
using AcceptanceTests.Common.Driver.Helpers;
using AcceptanceTests.Common.PageObject.Helpers;
using AcceptanceTests.Common.Test.Steps;
using FluentAssertions;
using OpenQA.Selenium;
using ServiceWebsite.AcceptanceTests.Data;
using ServiceWebsite.AcceptanceTests.Helpers;
using ServiceWebsite.AcceptanceTests.Pages.Representative;
using TechTalk.SpecFlow;

namespace ServiceWebsite.AcceptanceTests.Steps.Representative
{
    [Binding]
    public class PresentingTheCaseSteps : ISteps
    {
        private readonly Dictionary<string, UserBrowser> _browsers;
        private readonly TestContext _c;

        public PresentingTheCaseSteps(Dictionary<string, UserBrowser> browsers, TestContext testContext)
        {
            _browsers = browsers;
            _c = testContext;
        }

        public void ProgressToNextPage()
        {
            _browsers[_c.CurrentUser.Key].Driver.WaitForPageToLoad();
            _browsers[_c.CurrentUser.Key].Driver.WaitUntilVisible(PresentingTheCasePage.WhoWillBePresentingText).Displayed.Should().BeTrue();
            _browsers[_c.CurrentUser.Key].Driver.WaitUntilElementExists(CommonLocators.ElementContainingText(_c.ServiceWebConfig.TestConfig.TestData.PresentingTheCase.Answer)).Click();
            _browsers[_c.CurrentUser.Key].Driver.WaitUntilVisible(PresentingTheCasePage.ContinueButton).Click();
            _c.Test.Answers.Add(new SuitabilityAnswer
            {
                Answer = _c.ServiceWebConfig.TestConfig.TestData.PresentingTheCase.Answer,
                ExtendedAnswer = null,
                QuestionKey = RepresentativeQuestionKeys.PresentingTheCase
            });
        }

        [When(@"adds details of who will be presenting the case")]
        public void WhenAddsDetailsOfWhoWillBePresentingTheCase()
        {
            _browsers[_c.CurrentUser.Key].Driver.WaitUntilVisible(PresentingTheCasePage.FullNameTextField).SendKeys(_c.ServiceWebConfig.TestConfig.TestData.PresentingTheCase.WhoWillBePresentingName);
            _browsers[_c.CurrentUser.Key].Driver.WaitUntilVisible(PresentingTheCasePage.EmailTextField).SendKeys(_c.ServiceWebConfig.TestConfig.TestData.PresentingTheCase.WhoWillBePresentingEmail);
            _browsers[_c.CurrentUser.Key].Driver.WaitUntilVisible(PresentingTheCasePage.EmailTextField).SendKeys(Keys.Tab);
            _c.Test.Answers.Add(new SuitabilityAnswer
            {
                Answer = "Someone else will be presenting the case",
                ExtendedAnswer = null,
                QuestionKey = RepresentativeQuestionKeys.PresentingTheCase
            });
        }
    }
}
