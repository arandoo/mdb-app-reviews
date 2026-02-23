import * as esbuild from "esbuild";

async function build() {
  await esbuild.build({
    entryPoints: ["widget-src/index.ts"],
    bundle: true,
    minify: true,
    format: "iife",
    globalName: "ReviewsWidget",
    outfile: "public/widget/reviews-widget.js",
    loader: { ".css": "text" },
    target: ["es2018"],
  });
  console.log("Widget built → public/widget/reviews-widget.js");
}

build().catch((err) => {
  console.error("Widget build failed:", err);
  process.exit(1);
});
