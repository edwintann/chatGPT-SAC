var ajaxCall = (key, url, messages) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": messages
      }
    ],
        max_tokens: 1024,
        n: 1,
        temperature: 0.5,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
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

const url = "https://api.openai.com/v1";

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async post(apiKey, endpoint, messages) {
      const { response } = await ajaxCall(
        apiKey,
        `${url}/${endpoint}`,
        messages
      );
      console.log(response.choices[0].message.content);
      return response.choices[0].message.content;
    }
  }
  customElements.define("custom-widget", MainWebComponent);
})();
