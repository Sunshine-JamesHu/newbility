var newbility = newbility || {};

(function () {
  newbility.auth = newbility.auth || {};

  const ACCESS_TOKEN_KEY = 'access_token';

  newbility.auth.setToken = (token, expiresIn) => {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      JSON.stringify({
        token: token,
        expiresIn: expiresIn,
      })
    );
  };

  newbility.auth.getToken = () => {
    const dataJson = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (dataJson) {
      const data = JSON.parse(dataJson);
      if (data && data.token && Math.floor(Date.now()) + data.expiresIn * 1000 > Date.now()) {
        return data.token;
      }else{
        newbility.auth.clearToken();
      }
    }
    return null;
  };

  newbility.auth.clearToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  };

  // newbility.auth.httpRequest = async (url, method, data) => {
  //   var xhr = new XMLHttpRequest();
  //   const task = new Promise((resolve, rej) => {
  //     xhr.onreadystatechange = () => {
  //       if (xhr.readyState === XMLHttpRequest.DONE) {
  //         if (xhr.status === 200) {
  //           var result = JSON.parse(xhr.responseText);
  //           resolve(result);
  //         } else {
  //           rej();
  //         }
  //       }
  //     };
  //     xhr.onerror = () => {
  //       rej();
  //     };
  //     xhr.open(method, url, true);
  //     const reqDoc = data ? JSON.stringify(data) : null;
  //     xhr.send(reqDoc);
  //   });
  //   return await task;
  // };

  newbility.auth.httpRequest = async (url, method, data) => {
    const response = await fetch(url, {
      method: method,
      body: data ? JSON.stringify(data) : null,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const errMsg = 'Network response was not ok.';
    const result = await response.json();
    if (response.ok) {
      return result;
    } else if (response.status === 403) {
      const msg = result.msg ?? errMsg;
      throw new Error(msg);
    } else {
      throw new Error(errMsg);
    }
  };
})();

(function () {
  newbility.swagger = newbility.swagger || {};

  newbility.swagger.login = async () => {
    try {
      const loginUrl = newbility.swagger.authInfo.url;
      if (!loginUrl) throw new Error(`尚未设置获取[${ACCESS_TOKEN_KEY}]地址`);

      const authInfo = {};
      let fields = newbility.swagger.authInfo.fields;
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        const value = document.getElementById(field.id).value;
        if (field.required && !value) {
          alert(`[${field.displayName}] 不能为空`);
          return;
        }
        authInfo[field.id] = value;
      }
      const res = await newbility.auth.httpRequest(loginUrl, 'POST', authInfo);
      let authResult = {};
      if (res) {
        if (!!newbility.swagger.responseConverter) {
          authResult = newbility.swagger.responseConverter(res);
        } else {
          authResult = res;
        }
      }
      
      newbility.auth.setToken(authResult.token, authResult.expiresIn);

      // 处理样式
      const authBtn = document.getElementById('authorize');
      authBtn.innerText = newbility.swagger.getAuthorizeButtonText();
      authBtn.className = 'btn ' + newbility.swagger.getAuthorizeButtonCssClass();
      newbility.swagger.closeAuthDialog();
    } catch (error) {
      alert(error.message ?? '服务端错误~');
    }
  };

  newbility.swagger.logout = () => {
    newbility.auth.clearToken();

    // 处理样式
    const authorizeButton = document.getElementById('authorize');
    authorizeButton.innerText = newbility.swagger.getAuthorizeButtonText();
    authorizeButton.className = 'btn ' + newbility.swagger.getAuthorizeButtonCssClass();
  };

  newbility.swagger.createInputs = (modalUxContent) => {
    let fields = newbility.swagger.authInfo.fields;
    fields.forEach((field) => {
      newbility.swagger.createInput(modalUxContent, field.id, field.displayName, field.type);
    });
  };

  newbility.swagger.openAuthDialog = () => {
    newbility.swagger.closeAuthDialog();

    var newbilityAuthDialog = document.createElement('div');
    newbilityAuthDialog.className = 'dialog-ux';
    newbilityAuthDialog.id = 'newbility-auth-dialog';

    document.getElementsByClassName('swagger-ui')[1].appendChild(newbilityAuthDialog);

    // -- backdrop-ux
    var backdropUx = document.createElement('div');
    backdropUx.className = 'backdrop-ux';
    newbilityAuthDialog.appendChild(backdropUx);

    // -- modal-ux
    var modalUx = document.createElement('div');
    modalUx.className = 'modal-ux';
    newbilityAuthDialog.appendChild(modalUx);

    // -- -- modal-dialog-ux
    var modalDialogUx = document.createElement('div');
    modalDialogUx.className = 'modal-dialog-ux';
    modalUx.appendChild(modalDialogUx);

    // -- -- -- modal-ux-inner
    var modalUxInner = document.createElement('div');
    modalUxInner.className = 'modal-ux-inner';
    modalDialogUx.appendChild(modalUxInner);

    // -- -- -- -- modal-ux-header
    var modalUxHeader = document.createElement('div');
    modalUxHeader.className = 'modal-ux-header';
    modalUxInner.appendChild(modalUxHeader);

    var modalHeader = document.createElement('h3');
    modalHeader.innerText = 'Authorize';
    modalUxHeader.appendChild(modalHeader);

    // -- -- -- -- modal-ux-content
    var modalUxContent = document.createElement('div');
    modalUxContent.className = 'modal-ux-content';
    modalUxInner.appendChild(modalUxContent);

    modalUxContent.onkeydown = function (e) {
      if (e.keyCode === 13) {
        //try to login when user presses enter on authorize modal
        newbility.swagger.login();
      }
    };

    //Inputs
    newbility.swagger.createInputs(modalUxContent);

    //Buttons
    var authBtnWrapper = document.createElement('div');
    authBtnWrapper.className = 'auth-btn-wrapper';
    modalUxContent.appendChild(authBtnWrapper);

    //Close button
    var closeButton = document.createElement('button');
    closeButton.className = 'btn modal-btn auth btn-done button';
    closeButton.innerText = 'Close';
    closeButton.style.marginRight = '5px';
    closeButton.onclick = newbility.swagger.closeAuthDialog;
    authBtnWrapper.appendChild(closeButton);

    //Authorize button
    var authorizeButton = document.createElement('button');
    authorizeButton.className = 'btn modal-btn auth authorize button';
    authorizeButton.innerText = 'Login';
    authorizeButton.onclick = function () {
      newbility.swagger.login();
    };
    authBtnWrapper.appendChild(authorizeButton);
  };

  newbility.swagger.closeAuthDialog = () => {
    if (document.getElementById('newbility-auth-dialog')) {
      document.getElementsByClassName('swagger-ui')[1].removeChild(document.getElementById('newbility-auth-dialog'));
    }
  };

  newbility.swagger.createInput = (container, id, title, type) => {
    var wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    container.appendChild(wrapper);

    var label = document.createElement('label');
    label.innerText = title;
    wrapper.appendChild(label);

    var section = document.createElement('section');
    section.className = 'block-tablet col-10-tablet block-desktop col-10-desktop';
    wrapper.appendChild(section);

    var input = document.createElement('input');
    input.id = id;
    input.type = type ? type : 'text';
    input.style.width = '100%';
    section.appendChild(input);
  };

  newbility.swagger.getAuthorizeButtonText = () => {
    return newbility.auth.getToken() ? 'Logout' : 'Authorize';
  };

  newbility.swagger.getAuthorizeButtonCssClass = () => {
    return newbility.auth.getToken() ? 'cancel' : 'authorize';
  };

  newbility.swagger.getAuthPlugin = function () {
    return function (system) {
      return {
        components: {
          authorizeBtn: function () {
            const btn = system.React.createElement(
              'button',
              {
                id: 'authorize',
                className: 'btn ' + newbility.swagger.getAuthorizeButtonCssClass(),
                style: {
                  lineHeight: 'normal',
                },
                onClick: function () {
                  var authorizeButton = document.getElementById('authorize');
                  if (newbility.auth.getToken()) {
                    newbility.swagger.logout();
                    authorizeButton.innerText = newbility.swagger.getAuthorizeButtonText();
                    authorizeButton.className = 'btn ' + newbility.swagger.getAuthorizeButtonCssClass();
                  } else {
                    newbility.swagger.openAuthDialog(function () {
                      authorizeButton.innerText = newbility.swagger.getAuthorizeButtonText();
                      authorizeButton.className = 'btn ' + newbility.swagger.getAuthorizeButtonCssClass();
                      abp.swagger.closeAuthDialog();
                    });
                  }
                },
              },
              newbility.swagger.getAuthorizeButtonText()
            );
            const warp = system.React.createElement('div', { className: 'auth-wrapper' }, [btn]);
            return warp;
          },
        },
      };
    };
  };
})();
