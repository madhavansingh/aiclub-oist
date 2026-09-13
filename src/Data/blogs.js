// Add a new post at the top of this array each week.
// slug must be unique — it becomes the URL: /blog/your-slug

const blogs = [
  {
    slug: "gpt-6-astra-and-the-week-ai-got-faster",
    title: "GPT-6 Astra, Gemini 3.8, and the Week AI Got Faster",
    date: "2026-09-13",
    author: "AI Club Editorial",
    tags: ["AI", "News"],
    excerpt:
      "OpenAI shipped GPT-6 Astra. Google dropped Gemini 3.8 Flash. Here is what that week actually means if you are building at a campus club.",
    cover: "/blog/ai-blog-cover.png",
    content: [
      "This week the frontier moved again. OpenAI began rolling out GPT-6 Astra, a model it is positioning for serious computer use, coding, science, and professional work. Google, almost in the same breath, released Gemini 3.8 Flash as a faster workhorse for agent workflows, plus a locked-down Cyber variant for trusted defenders.",
      "The headline is capability. Astra is being framed as a generational jump in software engineering and browser use. Gemini 3.8 Flash is being framed as more reasoning at the same cheap Flash speed. For students, the useful takeaway is simpler: the tools we demo in workshops will feel outdated in months, not years.",
      "There is a second headline that matters more for a club like ours. Both labs are talking loudly about cybersecurity thresholds, monitoring, and who gets access to the most capable systems. Frontier models are no longer just chat boxes. They are agents that can click, code, and probe. That is exciting in a lab. It is also why safety is now part of the product launch, not an afterthought.",
      "So what should AI Club do with this? Build small, ship weekly, and stay current. Try the new APIs when they land. Compare how an agent handles a real campus task versus last semester's stack. And treat alignment, evals, and access control as skills worth learning — not as someone else's problem.",
      "The models will keep getting faster. Our job is to keep making things with them.",
    ],
  },
];

export default blogs;
