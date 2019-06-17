using System;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using ServiceWebsite.Common;
using ServiceWebsite.Controllers;
using ServiceWebsite.Domain;
using ServiceWebsite.Models;
using ServiceWebsite.Services;

namespace ServiceWebsite.UnitTests.Controllers
{
    public class ParticipantControllerTests
    {
        private const string Username = "some.user@hearings.reform.hmcts.net";
        private readonly Guid _hearingId = Guid.NewGuid();
        private ParticipantController _controller;
        private Mock<IHearingsService> _hearingService;
        private Mock<IParticipantService> _participantService;

        [SetUp]
        public void Setup()
        {
            _hearingService = new Mock<IHearingsService>();
            _participantService = new Mock<IParticipantService>();
            _controller = new ParticipantController(_hearingService.Object, _participantService.Object;);
            _controller.MockUserIdentity(Username);
        }

        [Test]
        public async Task should_return_badrequest_if_hearingId_is_empty()
        {
            var result = await _controller.UpdateSuitabilityAnswers(Guid.Empty, new System.Collections.Generic.List<HearingSuitabilityAnswer>());
            var badRequestresult = (BadRequestResult)result;
            Assert.AreEqual(400, badRequestresult.StatusCode);
        }

        [Test]
        public async Task should_return_not_found_if_no_hearing_for_user_is_found()
        {
            // given service returns
            _hearingService.Setup(x => x.GetParticipantId(Username, _hearingId))
                .ThrowsAsync(new NotFoundException("message"));
            var result = (NotFoundObjectResult)await _controller.UpdateSuitabilityAnswers(_hearingId, new System.Collections.Generic.List<HearingSuitabilityAnswer>());
            Assert.AreEqual($"No hearing with id '{_hearingId}' found for user", result.Value);
        }

        [Test]
        public async Task should_return_unauthorized_for_hearing_the_user_is_not_participant_in()
        {
            // given service throws
            _hearingService.Setup(x => x.GetParticipantId(Username, _hearingId))
                .ThrowsAsync(new UnauthorizedAccessException("msg"));

            var result = (UnauthorizedObjectResult)await _controller.UpdateSuitabilityAnswers(_hearingId, new System.Collections.Generic.List<HearingSuitabilityAnswer>());
            Assert.AreEqual(result.Value, $"User is not a participant of hearing with id '{_hearingId}'");
        }

        [Test]
        public async Task should_return_ok_if_suitability_answers_updated_successfully()
        {
            // given service throws()
            _hearingService.Setup(x => x.GetParticipantId(Username, _hearingId)).Returns(Task.FromResult(Guid.NewGuid()));

            var result = (NoContentResult)await _controller.UpdateSuitabilityAnswers(_hearingId, new System.Collections.Generic.List<HearingSuitabilityAnswer>());
            Assert.AreEqual(204, result.StatusCode);
        }

    }
}