import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import { DEFAULT_PORT_API, DEFAULT_PORT_WEB, DEFAULT_SERVER_API_ROOT, toNumber } from "../rad-common/src/config_defaults";
import { compilerOptions } from "./tsconfig.json";
import { resolve } from "path";

// add env files - only environment variables starting with VITE_ gets included in client side
config({ path: "../.env" });

const ENV = process.env;
const PORT_API = toNumber(ENV.PORT_API, DEFAULT_PORT_API);
const PORT_WEB = toNumber(ENV.PORT_WEB, DEFAULT_PORT_WEB);
const SERVER_API_ROOT = ENV.SERVER_API_ROOT || DEFAULT_SERVER_API_ROOT;

//https://github.com/vitejs/vite/issues/88
// it works fine if path points to entry
const alias = Object.entries(compilerOptions.paths).reduce((acc, [key, [value]]) => {
    const aliasKey = key.substring(0, key.length);
    const path = value.substring(0, value.length);
    return {
        ...acc,
        [aliasKey]: resolve(__dirname, path)
    };
}, {});

// https://vitejs.dev/config/
export default defineConfig({
    root: "./src",
    plugins: [react()],
    resolve: {
        alias
    },
    server: {
        port: PORT_WEB,
        proxy: {
            [SERVER_API_ROOT]: {
                target: `http://localhost:${PORT_API}`,
                changeOrigin: true
            },
            // TODO: add as URL ?
            ["/login"]: {
                target: `http://localhost:${PORT_API}`,
                changeOrigin: true,
                secure: false
            },
            ["/redirect"]: {
                target: `http://localhost:${PORT_API}`,
                changeOrigin: true,
                secure: false
            }
        }
    },
    build: {
        emptyOutDir: true,
        outDir: "../dist"
    }
});
