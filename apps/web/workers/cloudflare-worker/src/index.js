export default {
  async fetch(request) {
    return new Response("Cloudflare Worker for SAMA", { status: 200 });
  }
};
