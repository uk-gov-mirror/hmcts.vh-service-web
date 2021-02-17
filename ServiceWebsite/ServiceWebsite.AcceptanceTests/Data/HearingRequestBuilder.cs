﻿using System;
using System.Collections.Generic;
using ServiceWebsite.Services.TestApi;

namespace ServiceWebsite.AcceptanceTests.Data
{
    internal class HearingRequestBuilder
    {
        private readonly CreateHearingRequest _request;
        private const string CASE_TYPE = "Generic";
        private const string DEFAULT_VENUE = "Birmingham Civil and Family Justice Centre";
        private const string CACD_CASE_TYPE_NAME = "Court of Appeal Criminal Division";

        public HearingRequestBuilder()
        {
            _request = new CreateHearingRequest()
            {
                Application = Application.ServiceWeb,
                Audio_recording_required = false,
                Case_type = CASE_TYPE,
                Questionnaire_not_required = false,
                Scheduled_date_time = DateTime.UtcNow.AddHours(1),
                Test_type = TestType.Automated,
                Users = new List<User>(),
                Venue = DEFAULT_VENUE
            };
        }

        public HearingRequestBuilder WithUsers(List<User> users)
        {
            _request.Users = users;
            return this;
        }

        public CreateHearingRequest Build()
        {
            return _request;
        }

        public HearingRequestBuilder WithCACDCaseType()
        {
            _request.Case_type = CACD_CASE_TYPE_NAME;
            return this;
        }
    }
}
