﻿using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using ServiceWebsite.Configuration;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using ServiceWebsite.Common;

namespace ServiceWebsite.Security
{
    public abstract class BaseServiceTokenHandler : DelegatingHandler
    {
        private readonly ITokenProvider _tokenProvider;
        private readonly IMemoryCache _memoryCache;
        private readonly SecuritySettings _securitySettings;
        protected readonly ServiceSettings ServiceSettings;
        
        protected abstract string TokenCacheKey { get; }
        protected abstract string ClientResource { get; }

        protected BaseServiceTokenHandler(IOptions<SecuritySettings> securitySettings, 
            IOptions<ServiceSettings> serviceSettings, IMemoryCache memoryCache, ITokenProvider tokenProvider)
        {
            _securitySettings = securitySettings.Value;
            ServiceSettings = serviceSettings.Value;
            _memoryCache = memoryCache;
            _tokenProvider = tokenProvider;
        }
        
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            var properties = new Dictionary<string, string>();
            
            var token = _memoryCache.Get<string>(TokenCacheKey);
            if (string.IsNullOrEmpty(token))
            {
                var authenticationResult = _tokenProvider.GetAuthorisationResult(_securitySettings.UserApiClientId,
                    _securitySettings.UserApiClientSecret, ClientResource);
                token = authenticationResult.AccessToken;
                var tokenExpireDateTime = authenticationResult.ExpiresOn.DateTime.AddMinutes(-1);
                _memoryCache.Set(TokenCacheKey, token, tokenExpireDateTime);
            }
            
            request.Headers.Add("Authorization", $"Bearer {token}");
            try
            {
                return await base.SendAsync(request, cancellationToken);
            }
            catch (Exception e)
            {
                ApplicationLogger.TraceException(TraceCategories.Authorization, "BookHearing Client Exception", e, null,
                    properties);
                throw;
            }
        }
    }
}
