import axios from 'axios';

export async function checkGoogleAuthToken(
	token: string,
	email: string,
): Promise<boolean> {
	const { data: googleResponse } = await axios.request({
		method: 'GET',
		url: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
		params: {
			access_token: token,
		},
	});

	return email === googleResponse.email;
}

export async function checkFacebookAuthToken(
	token: string,
	email: string,
): Promise<boolean> {
	const { data: facebookResponse } = await axios.request({
		method: 'GET',
		url: 'https://graph.facebook.com/v2.3/me',
		params: {
			access_token: token,
		},
	});

	return email === facebookResponse.email;
}
