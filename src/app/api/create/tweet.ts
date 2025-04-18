"use client"; // if you're using Next.js 13+ App Router

export const handleTweet = () => {
  const text = encodeURIComponent(
    "Check out Gitbrain – the AI tool for devs 🚀"
  );
  const url = encodeURIComponent("https://gitbrain.dev");
  const hashtags = "DevTool,AI";
  const via = "imtarunk";

  const tweetUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}&via=${via}`;

  window.open(tweetUrl, "_blank"); // opens in a new tab
  // or use: window.location.href = tweetUrl; to open in same tab
};
