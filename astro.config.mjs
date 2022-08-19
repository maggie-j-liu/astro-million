import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    {
      name: "astro-million",
      hooks: {
        "astro:config:setup": ({ addRenderer }) => {
          addRenderer({
            name: "astro-million",
            clientEntrypoint: "./renderer/client.js",
            serverEntrypoint: "./renderer/server.js",
            jsxImportSource: "million",
            jsxTransformOptions: async () => {
              const {
                default: { default: jsx },
              } = await import("@babel/plugin-transform-react-jsx");
              return {
                plugins: [
                  jsx({}, { runtime: "automatic", importSource: "million" }),
                ],
              };
            },
          });
        },
      },
    },
  ],
});
