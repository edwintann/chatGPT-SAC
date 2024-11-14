var ajaxCall = (key, url, prompt) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1024,
        n: 1,
        temperature: 0.5,
      }),
      headers: {
        "AI-Resource-Group": "default",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      crossDomain: true,
      success: function (response, status, xhr) {
        resolve({ response, status, xhr });
      },
      error: function (xhr, status, error) {
        const err = new Error('xhr error');
        err.status = xhr.status;
        reject(err);
      },
    });
  });
};

const url = "https://api.ai.prod.ap-southeast-2.aws.ml.hana.ondemand.com/v2/inference/deployments/da9a4a9867cb32b8/chat";

async function getAccessToken(username, password, authUrl) {
  const authHeaders = {
    "AI-Resource-Group": "default",
    "Content-Type": "application/json"
  };
 
  try {
    const response = await axios.get(authUrl, {
      headers: authHeaders
    });
 
    if (response.status === 200) {
      console.log(response.data.access_token);
      return response.data.access_token;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
}

(async function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async post(clientID, clientSecret, endpoint, prompt) {

      const authUrl = "https://dial-3-0-zme762l7.authentication.ap10.hana.ondemand.com/oauth/token?grant_type=client_credentials";
      const apiKey = await getAccessToken(clientID, clientSecret, authUrl);
      if (!apiKey) {
        console.error('Failed to retrieve API key');
        return;
      }
      
      const { response } = await ajaxCall(
        apiKey,
        `${url}/${endpoint}`,
        prompt
      );
      console.log(response.choices[0].text);
      return response.choices[0].text;
    }
  }
  customElements.define("custom-widget", MainWebComponent);
})();
