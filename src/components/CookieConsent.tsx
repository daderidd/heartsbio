import { useState, useEffect } from 'react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allPreferences);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(essentialOnly);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowPreferences(false);

    // Dispatch custom event to notify Google Analytics component
    const event = new CustomEvent('cookieConsentUpdated', {
      detail: prefs
    });
    window.dispatchEvent(event);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Can't disable essential cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setShowPreferences(false)}
        aria-hidden="true"
      />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-dark-green/10">
          {!showPreferences ? (
            // Simple Banner
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <svg
                  className="w-8 h-8 text-dark-green flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-2">
                    We value your privacy
                  </h3>
                  <p className="text-black/70 leading-relaxed">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                    By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more in our{' '}
                    <a
                      href="/privacy"
                      className="text-dark-green hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-dark-green text-white rounded-lg font-semibold hover:bg-dark-green/90 transition-colors"
                  aria-label="Accept all cookies"
                >
                  Accept All
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-3 bg-gray-100 text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  aria-label="Reject non-essential cookies"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-6 py-3 border-2 border-dark-green text-dark-green rounded-lg font-semibold hover:bg-dark-green/5 transition-colors"
                  aria-label="Customize cookie preferences"
                >
                  Customize
                </button>
              </div>
            </div>
          ) : (
            // Detailed Preferences
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-black mb-2">
                  Cookie Preferences
                </h3>
                <p className="text-black/70">
                  Choose which cookies you want to allow. You can change these settings at any time.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Essential Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-black mb-1">
                      Essential Cookies
                    </h4>
                    <p className="text-sm text-black/70">
                      Required for the website to function properly. These cannot be disabled.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-dark-green mr-3">Always Active</span>
                    <div className="w-12 h-6 bg-dark-green rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-black mb-1">
                      Analytics Cookies
                    </h4>
                    <p className="text-sm text-black/70">
                      Help us understand how visitors interact with our website to improve user experience.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${
                      preferences.analytics ? 'bg-dark-green' : 'bg-gray-300'
                    }`}
                    aria-label={`${preferences.analytics ? 'Disable' : 'Enable'} analytics cookies`}
                    role="switch"
                    aria-checked={preferences.analytics}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-black mb-1">
                      Marketing Cookies
                    </h4>
                    <p className="text-sm text-black/70">
                      Used to deliver personalized content and track campaign effectiveness.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${
                      preferences.marketing ? 'bg-dark-green' : 'bg-gray-300'
                    }`}
                    aria-label={`${preferences.marketing ? 'Disable' : 'Enable'} marketing cookies`}
                    role="switch"
                    aria-checked={preferences.marketing}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.marketing ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptSelected}
                  className="px-6 py-3 bg-dark-green text-white rounded-lg font-semibold hover:bg-dark-green/90 transition-colors"
                  aria-label="Save cookie preferences"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-black rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  aria-label="Cancel and go back"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
