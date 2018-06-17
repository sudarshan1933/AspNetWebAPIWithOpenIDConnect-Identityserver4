using Microsoft.Owin.Security.Cookies;
using Owin;
using Microsoft.Owin.Security;


using Microsoft.Owin.Security.OpenIdConnect;

using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.Owin;
using Microsoft.IdentityModel.Tokens;


namespace SampleOpenIDDemo.API
{
    public partial class Startup
    {
        public void ConfigureAuth(IAppBuilder app)
        {
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

            app.UseCookieAuthentication(new CookieAuthenticationOptions());


            app.UseOpenIdConnectAuthentication(
                new OpenIdConnectAuthenticationOptions
                {
                    
                    ClientId = "AngularCore",
                    Authority = "https://localhost:44381/",
                    TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidAudience = "mywebapicore",
                        ValidateAudience = true
                    },
                    Notifications = new OpenIdConnectAuthenticationNotifications
                    {
                        RedirectToIdentityProvider = (context) =>
                        {
                            Debug.WriteLine("*** RedirectToIdentityProvider");
                            return Task.FromResult(0);
                        },
                        MessageReceived = (context) =>
                        {
                            Debug.WriteLine("*** MessageReceived");
                            return Task.FromResult(0);
                        },
                        SecurityTokenReceived = (context) =>
                        {
                            Debug.WriteLine("*** SecurityTokenReceived");
                            return Task.FromResult(0);
                        },
                        SecurityTokenValidated = (context) =>
                        {
                            Debug.WriteLine("*** SecurityTokenValidated");
                            return Task.FromResult(0);
                        },
                        AuthorizationCodeReceived = (context) =>
                        {
                            Debug.WriteLine("*** AuthorizationCodeReceived");
                            return Task.FromResult(0);
                        },
                        AuthenticationFailed = (context) =>
                        {
                            Debug.WriteLine("*** AuthenticationFailed");
                            return Task.FromResult(0);
                        }

                    }
                });
        }
    }
}
