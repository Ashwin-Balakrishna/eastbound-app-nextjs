const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
// const { PHASE_PRODUCTION_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        cdn_url: "https://drzmekkajvsr5.cloudfront.net/",
        customKey2: "ssskkk",
        customKey3: "i000077770ii",
        // global_url: "https://agentms.2hubdev.link",
        global_url: "https://gateway.2hubdev.link/python/agent",
        // global_url: "http://0.0.0.0:8800",
        // customNodeUrl:'https://nodems.2hubdev.link',
        customNodeUrl:'https://gateway.2hubdev.link/fastify',
        // customAdminUrl:'https://adminms.2hubdev.link',
        customAdminUrl:'https://gateway.2hubdev.link/python/admin',
        // global_url: "https://gateway.2hub.co.in/python/agent",
        // customNodeUrl:'https://gateway.2hub.co.in/fastify',
        // customAdminUrl:'https://gateway.2hub.co.in/python/admin',
        customUrl:'http://3.110.51.61',
        customS3Url:'https://agents-app.s3.ap-south-1.amazonaws.com/',
        NEXT_TELEMETRY_DISABLED: 1,
      },
    };
  }
  return {
    env: {
      cdn_url: "https://drzmekkajvsr5.cloudfront.net/",
      customKey2: "ssskkk",
      customKey3: "i000077770ii",
      // global_url: "http://0.0.0.0:8800",
      global_url: "https://agentms.2hubdev.link",
      customNodeUrl:'https://nodems.2hubdev.link',
      customAdminUrl:'https://adminms.2hubdev.link',
      // global_url: "https://gateway.2hub.co.in/python/agent",
      // customNodeUrl:'https://gateway.2hub.co.in/fastify',
      // customAdminUrl:'https://gateway.2hub.co.in/python/admin',
      customUrl:'http://3.110.51.61',
      customS3Url:'https://agents-app.s3.ap-south-1.amazonaws.com/',
      NEXT_TELEMETRY_DISABLED: 1,
    },
  };
};
