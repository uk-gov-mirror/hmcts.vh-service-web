﻿using FluentAssertions;
using OpenQA.Selenium;
using ServiceWebsite.AcceptanceTests.Helpers;
using System.Linq;

namespace ServiceWebsite.AcceptanceTests.Pages
{
    public class ErrorMessage
    {
        private readonly BrowserContext _browserContext;
        public ErrorMessage(BrowserContext browserContext)
        {
            _browserContext = browserContext;
        }

        public void ValidateErrorMessage(int errorCounter)
        {
            GetMethods.GetElements(By.CssSelector("span.govuk-error-message"), _browserContext).Count().Should().Be(errorCounter);
            _browserContext.NgDriver.Navigate().Refresh();
        }
    }
}