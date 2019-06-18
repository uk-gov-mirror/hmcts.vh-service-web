using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using NUnit.Framework;
using ServiceWebsite.BookingsAPI.Client;
using ServiceWebsite.Common;
using ServiceWebsite.Services;

namespace ServiceWebsite.UnitTests
{
    public class HearingServiceTests
    {
        private HearingsService _hearingService;
        private Mock<IBookingsApiClient> _apiClient;

        private const string Username = "username";
        private readonly Guid _hearingId = Guid.NewGuid();
        private readonly Guid participantId = Guid.NewGuid();
        private readonly DateTime _scheduledDateTime = new DateTime(2019, 02, 03, 14, 15, 0);
        private const string HearingType = "hearingType";
        private const string CaseType = "caseType";

        private readonly CaseResponse _case = new CaseResponse
        {
            Is_lead_case = true,
            Name = "case name",
            Number = "case number"
        };

        [SetUp]
        public void Setup()
        {
            _apiClient = new Mock<IBookingsApiClient>();
           _hearingService = new HearingsService(_apiClient.Object);
        }

        [Test]
        public async Task should_return_a_mapped_hearing_for_hearing_with_user_as_participant()
        {
            GivenApiHasResponseWithCase(_case);

            // the hearing is properly mapped and returned
            var hearing  = await _hearingService.GetHearingFor(Username, _hearingId);
            Assert.AreEqual(_hearingId, hearing.Id);
            Assert.AreEqual(_case.Name, hearing.CaseName);
            Assert.AreEqual(_case.Number, hearing.CaseNumber);
            Assert.AreEqual(CaseType, hearing.CaseType);
            Assert.AreEqual(HearingType, hearing.HearingType);
            Assert.AreEqual(_scheduledDateTime, hearing.ScheduledDateTime);
        }
        
        [Test]
        public async Task should_use_first_best_case_if_lead_case_is_missing()
        {
            var notLeadCase = new CaseResponse
            {
                Is_lead_case = false,
                Name = "not lead case name",
                Number = "not lead case number"
            };
            GivenApiHasResponseWithCase(notLeadCase);

            // the hearing is properly mapped and returned
            var hearing  = await _hearingService.GetHearingFor("username", _hearingId);
            Assert.AreEqual(notLeadCase.Name, hearing.CaseName);
            Assert.AreEqual(notLeadCase.Number, hearing.CaseNumber);
        }

        [Test]
        public void should_throw_not_found_for_missing_hearings()
        {
            // given
            var notFoundException = new BookingsApiException("msg", 404, "resp", null, null);
            _apiClient.Setup(x => x.GetHearingDetailsByIdAsync(_hearingId))
                .ThrowsAsync(notFoundException);

            // another not found exception is raised
            Assert.ThrowsAsync<NotFoundException>(() => _hearingService.GetHearingFor("username", _hearingId));
        }
        
        [Test]
        public void should_rethrow_general_api_exceptions()
        {
            // given
            var serverErrorException = new BookingsApiException("msg", 500, "resp", null, null);
            _apiClient.Setup(x => x.GetHearingDetailsByIdAsync(_hearingId))
                .ThrowsAsync(serverErrorException);

            // the exception is rethrown
            Assert.ThrowsAsync<BookingsApiException>(() => _hearingService.GetHearingFor("username", _hearingId));
        }

        [Test]
        public void should_rethrow_general_api_exception_when_get_participant_id_called()
        {
            // given
            var serverErrorException = new BookingsApiException("msg", 500, "resp", null, null);
            _apiClient.Setup(x => x.GetHearingDetailsByIdAsync(_hearingId))
                .ThrowsAsync(serverErrorException);

            // the exception is rethrown
            Assert.ThrowsAsync<BookingsApiException>(() => _hearingService.GetParticipantId("username", _hearingId));
        }

        [Test]
        public void should_unauthorized_if_user_is_not_participant()
        {
            // given a response without participants
            GivenApiHasResponse(new HearingDetailsResponse
            {
                Id = _hearingId,
                Scheduled_date_time = _scheduledDateTime,
                Participants = new List<ParticipantResponse>(),
                Cases = new List<CaseResponse> { _case }
            });

            // then the user is not authorized
            Assert.ThrowsAsync<UnauthorizedAccessException>(() => _hearingService.GetHearingFor("username", _hearingId));
        }

        [Test]
        public async Task should_return_participant_id_should_return_a_mapped_hearing_for_hearing_with_user_as_participant()
        {
            GivenApiHasResponseWithCase(_case);
            var participantid = await _hearingService.GetParticipantId(Username, _hearingId);
            Assert.AreNotEqual(participantid, Guid.Empty);
        }

        private void GivenApiHasResponseWithCase(CaseResponse caseResponse)
        {
            GivenApiHasResponse(new HearingDetailsResponse
            {
                Id = _hearingId,
                Scheduled_date_time = _scheduledDateTime,
                Case_type_name = CaseType,
                Hearing_type_name = HearingType,
                Participants = new List<ParticipantResponse>
                {
                    new ParticipantResponse { Username = Username, Id = participantId }
                },
                Cases = new List<CaseResponse> { caseResponse }
            });
        }

        private void GivenApiHasResponse(HearingDetailsResponse response)
        {
            _apiClient.Setup(x => x.GetHearingDetailsByIdAsync(_hearingId))
                .ReturnsAsync(response);
        }
    }
}