import { v4 as uuidv4 } from 'uuid';
import { APPLICATION_JSON, CONTENT_TYPE } from '../Constants';
import { SUBMIT_TRANSACTION } from '../Constants/Routes';

let init = false;
let iframe = null;
let pendingRequests = [];
let identityWindow = null;
let hasInfoBeenSent = false;
let customApprovalEvent = null;

function respond(e, t, n) {
    e.postMessage(
      {
        id: t,
        service: "identity",
        payload: n,
      },
      "*"
    );
  }

const postMessage = (e) => {
    init
      ? iframe.contentWindow.postMessage(e, "*")
      : pendingRequests.push(e);
}

function handleInit(e) {
    if (!init) {
      init = true;
      iframe = document.getElementById("identity");
  
      for (const e of pendingRequests) {
        postMessage(e);
      }
  
      pendingRequests = [];
    }
    respond(e.source, e.data.id, {});
}

function handleLogin() {
    if (identityWindow) {
      identityWindow.close();
      identityWindow = null;
    }
}

export function submitTransaction(signedTransactionHex) {
  return fetch(SUBMIT_TRANSACTION, {
      method: "POST",
      headers: {
        [CONTENT_TYPE]: APPLICATION_JSON
      },
      body: JSON.stringify({TransactionHex: signedTransactionHex}),
  });
}

export function createNftBid() {

}

export function signTransaction(payload) {
  const id = uuidv4();
  postMessage({
    id,
    service: "identity",
    method: 'sign',
    payload,    
  });

  return new Promise((resolve) => {
    const handleSignResponse = (message) => {
      if(message?.data?.id === id) {
        window.removeEventListener("message", handleSignResponse);
        return resolve(message.data.payload);
      }
    }
  
    window.addEventListener("message", handleSignResponse);
  });
}

export function sendInfoMessageToIframe() {
  if(!hasInfoBeenSent) {

    hasInfoBeenSent = true;
    const id = uuidv4();

    postMessage({
      id,
      service: 'identity',
      method: 'info',
    })

    const handleInfoResponse = (message) => {
      if(message?.data?.id === id) {
        if(!message.data.payload.browserSupported) {
          alert("Bitclout Identity doesn't support your browser.");
        }
        else if(!message.data.payload.hasStorageAccess) {
          iframe.style.display = "";
        }
        window.removeEventListener("message", handleInfoResponse);
      }
    }

    window.addEventListener("message", handleInfoResponse);
  }
}

export function login (level = 4) {
    identityWindow = window.open(
        "https://identity.bitclout.com/log-in?accessLevelRequest=" + level,
        null,
        "toolbar=no, width=800, height=1000, top=0, left=0"
    );
}

export function logout (key) {
  identityWindow = window.open(`https://identity.bitclout.com/logout?publicKey=${key}`);
}

export function askApproval(TransactionHex, customEvent) {
  identityWindow = window.open(`https://identity.bitclout.com/approve?tx=${TransactionHex}`);
  if(customEvent) {
    customApprovalEvent = customEvent;
  }
}

export default function messageHandler(message, setIdentityData){
    const {
      data: { method, payload },
    } = message;
  
    if (method === "initialize") {
      handleInit(message);
    } else if (method === "login") {
      if(!payload.signedTransactionHex) {
        setIdentityData(payload);
      }
      else {
        submitTransaction(payload.signedTransactionHex).then(() => {
          if(customApprovalEvent) {
            window.dispatchEvent(customApprovalEvent);
          }
        });
      }
      handleLogin(payload);
      
    }
    else if(method === "storageGranted") {
      iframe.style.display = "none";
    }
};