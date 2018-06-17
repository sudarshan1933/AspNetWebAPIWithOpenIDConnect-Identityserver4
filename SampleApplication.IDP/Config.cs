using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;
using System.Security.Claims;

namespace SampleApplication.IDP
{
    public static class Config
    {
        // clients that are allowed to access resources from the Auth server 
        public static List<TestUser> GetUsers()
        {
            return new List<TestUser>
            {
                // Hybrid Flow = OpenId Connect + OAuth
                // To use both Identity and Access Tokens
                new TestUser
                {
                    SubjectId="1",
                    Username="asd",
                    Password="asd",
                    Claims = new List<Claim>
                    {
                        new Claim("given_name","asd"),
                        new Claim("family_name","asdf")
                    }

                },
                new TestUser
                {
                    SubjectId="2",
                    Username="xyz",
                    Password="xyz",
                    Claims = new List<Claim>
                    {
                        new Claim("given_name","xyz"),
                        new Claim("family_name","xyza")
                    }

                }
            };
        }

        internal static IEnumerable<ApiResource> GetAPIResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("mywebapicore","Full access to MyWebAPICore")
                //{
                //    Name = "mywebapicore",
                //    Scopes =
                //    {
                //        new Scope()
                //        {
                //            Name = "mywebapicore",
                //            DisplayName = "Full access to MyWebAPICore"
                //        }
                //    }
                //}
            };
        }



        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(), //User Identifier Subject Claim is returned
                new IdentityResources.Profile(), // If Client scope is profile then given name is returned
               
            };
        }

        public static IEnumerable<Client> GetClients()
        {
            return new List<Client>
            {
                //Congiguration for this Client - 
                new Client
                {
                    ClientId = "AngularCore",
                    ClientName = "Client Name AngularCore",
                    AllowedGrantTypes = GrantTypes.Implicit,

                    RedirectUris = new List<string> { "https://localhost:44301/authcallback"},
                    PostLogoutRedirectUris = { "https://localhost:44301/" },
                    AllowedCorsOrigins = new List<string> {"https://localhost:44301/"},
                    AllowAccessTokensViaBrowser = true,
                    AllowedScopes = new List<string> {"openid", "profile", "mywebapicore" }
                }
            };
        }
    }
}
