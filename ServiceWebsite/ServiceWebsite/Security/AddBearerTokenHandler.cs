using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace ServiceWebsite.Security
{
    public class AddBearerTokenHeaderHandler : DelegatingHandler
    {
        private const string TokenKey = "s2stoken";
        private readonly IMemoryCache _memoryCache;
        private readonly EnvironmentSettings _environmentSettings;
        private readonly ITokenProvider _tokenProvider;

        public AddBearerTokenHeaderHandler(ITokenProvider tokenProvider, IMemoryCache memoryCache,
            IOptions<EnvironmentSettings> securitySettings)
        {
            _tokenProvider = tokenProvider;
            _memoryCache = memoryCache;
            _environmentSettings = securitySettings.Value;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            var token = _memoryCache.Get<string>(TokenKey);
            if (string.IsNullOrEmpty(token))
            {
                var authenticationResult = _tokenProvider.GetAuthorisationResult(_environmentSettings.ClientId,
                    _environmentSettings.ClientSecret, _environmentSettings.HearingsApiResourceId);

                token = authenticationResult.AccessToken;
                var tokenExpireDateTime = authenticationResult.ExpiresOn.DateTime.AddMinutes(-1);
                _memoryCache.Set(TokenKey, token, tokenExpireDateTime);
            }

            request.Headers.Add("Authorization", $"Bearer {token}");
            return await base.SendAsync(request, cancellationToken);
        }
    }
}