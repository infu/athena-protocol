let prevElistener = false;
export const waitForMessage = (type, whitelisted) => {
  return new Promise((resolve, reject) => {
    const elistener = msg => {
      if (!msg.isTrusted) return;
      console.log(msg.origin);
      if (whitelisted.indexOf(msg.origin) === -1) return;
      console.log(msg);

      if (msg.data.type === type) {
        resolve(msg.data.payload);
        window.removeEventListener('message', elistener);
      }
    };
    if (prevElistener) {
      window.removeEventListener('message', prevElistener);
      prevElistener = false;
    }

    prevElistener = elistener;
    window.addEventListener('message', elistener, false);
  });
};
