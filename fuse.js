const {
    FuseBox,
    VueComponentPlugin,
    CopyPlugin,
    QuantumPlugin,
    SassPlugin,
    CSSPlugin,
    CSSResourcePlugin,
    WebIndexPlugin,
    Sparky,
    JSONPlugin,
} = require("fuse-box");

let fuse;
let isProduction = false;

Sparky.task("set-prod", () => {
    isProduction = true;
});
Sparky.task("clean", () => Sparky.src("./dist").clean("dist/"));
Sparky.task("watch-assets", () => Sparky.watch("./assets", {base: "./src"}).dest("./dist"));
Sparky.task("copy-assets", () => Sparky.src("./assets/**/**.*", {base: "./src"}).dest("./dist"));

Sparky.task("config", () => {
    fuse = FuseBox.init({
        homeDir: "./src",
        output: "dist/$name.js",
        hash: isProduction,
        sourceMaps: {project: true, vendor: true},
        useTypescriptCompiler: true,
        allowSyntheticDefaultImports: true,
        target: "browser",
        alias: {
            '@': '~',
        },
        plugins: [
            VueComponentPlugin({
                style: [
                    SassPlugin({
                        importer: true
                    }),
                    CSSResourcePlugin(),
                    CSSPlugin({
                        group: 'components.css',
                        inject: 'components.css'
                    })
                ]
            }),
            [SassPlugin(), CSSResourcePlugin(), CSSPlugin()],
            WebIndexPlugin({
                template: "./index.html"
            }),
            CopyPlugin({
                files: ["./assets/*.css"],
                dest: "assets"
            }),
            JSONPlugin(),
            // QuantumPlugin does not supports sourcemaps
            isProduction && QuantumPlugin({
                bakeApiIntoBundle: "vendor",
                polyfills: ["Promise"],
                ensureES5: true,
                manifest: true,
                uglify: true,
                treeshake: true,
            }),
        ],
    });

    if (!isProduction) {
        fuse.dev({
            open: true,
            port: 8080
        });
    }

    const vendor = fuse.bundle("vendor")
        .instructions("~ main.ts");

    const app = fuse.bundle("app")
        .instructions("> [main.ts]");

    if (!isProduction) {
        app.watch().hmr();
    } else {
        vendor.cache(false);
        app.cache(false);
    }
});

Sparky.task("default", ["clean", "watch-assets", "config"], () => {
    return fuse.run();
});

Sparky.task("dist", ["clean", "copy-assets", "set-prod", "config"], () => {
    return fuse.run();
});
