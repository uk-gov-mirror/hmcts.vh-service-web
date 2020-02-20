﻿using System.Collections.Generic;
using FluentAssertions;

namespace ServiceWebsite.AcceptanceTests.Pages.Journeys
{
    public class RepresentativeJourney : IJourney
    {
        public List<Page> Journey()
        {
            return new List<Page>()
            {
                Page.Login,
                Page.YourVideoHearing,
                Page.PresentingTheCase,
                Page.OtherInformation,
                Page.CheckYourAnswers,
                Page.AnswersSaved,
                Page.CheckYourComputer,
                Page.SwitchOnCameraAndMicrophone,
                Page.TestYourEquipment,
                Page.CameraWorking,
                Page.MicrophoneWorking,
                Page.VideoWorking,
                Page.ThankYouRep
            };
        }

        public void VerifyUserIsApplicableToJourney(string currentUserRole)
        {
            currentUserRole.ToLower().Should().BeOneOf("representative");
        }

        public void VerifyDestinationIsInThatJourney(Page destinationPage)
        {
            Journey().Should().Contain(destinationPage);
        }

        public Page GetNextPage(Page currentPage)
        {
            return Journey()[Journey().IndexOf(currentPage) + 1];
        }
    }
}
