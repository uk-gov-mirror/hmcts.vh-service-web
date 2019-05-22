﻿using OpenQA.Selenium;
using ServiceWebsite.AcceptanceTests.Helpers;

namespace ServiceWebsite.AcceptanceTests.Pages
{
    public class DecisionJourney : JourneyStepPage
    {
        private readonly string _pageUrl;
        public DecisionJourney(BrowserContext browserContext, string pageUrl) : base(browserContext, pageUrl)
        {
            _pageUrl = pageUrl;
        }
        
        public void SelectYes()
        {
            BrowserContext.Retry(() => SetMethods.SelectRadioButton(By.XPath("//*[@for='choice-yes']"), BrowserContext), 1);            
        }
        public void SelectYes(string detail)
        {
            SelectYes();
            SetMethods.InputValue(detail, By.Id("details"), BrowserContext);
        }
        public void SelectNo()
        {
            BrowserContext.Retry(() => SetMethods.SelectRadioButton(By.XPath("//*[@for='choice-no']"), BrowserContext), 1);
        }

        public void Navigate()
        {
            BrowserContext.GoToPage(_pageUrl);
        }
    }
}