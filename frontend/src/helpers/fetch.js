let isRefreshing = false;
let refreshPromise = null;

// Extract the CSRF token string from Cookie
const getCSRFToken = () => {
    return document.cookie
        .split('; ')
        .find((section) => section.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
};

// Send a request to refresh tokens. If there's already an
// ongoing request, return the promise instead. When multiple
// requests come in at once, only one promise is served, and any
// requests waiting on that promise will be fulfilled when it
// finishes.
const refresh = async () => {
    if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRF-TOKEN': getCSRFToken()
            }
        }).then((response) => {
            isRefreshing = false;
            return response.ok;
        });
    }

    return refreshPromise;
};

// Fetch wrapper to automatically include CSRF header and
// refresh and retry on expired tokens.
export const fetchWrapper = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            ...options.headers,
            'X-CSRF-TOKEN': getCSRFToken()
        }
    });

    // Refresh token and retry response if request fails due to
    // expired JWT (401) or CSRF token (403). Both are refreshed
    // simultaneously at the /refresh endpoint.
    if (
        !options.skipRetry &&
        (response.status === 401 || response.status === 403)
    ) {
        const isRefreshed = await refresh();

        if (isRefreshed) {
            // After refreshing, re-send the original request
            return fetch(url, {
                ...options,
                credentials: 'include',
                headers: {
                    ...options.headers,
                    'X-CSRF-TOKEN': getCSRFToken()
                }
            });
        } else {
            // If the refresh failed, that more than likely means
            // the refreshToken is expired, thus session is expired.
            throw new Error('Session expired');
        }
    }

    return response;
};
