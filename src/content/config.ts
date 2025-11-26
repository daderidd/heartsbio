import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    category: z.string(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    client: z.string().optional(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    kpis: z.array(z.object({
      label: z.string(),
      value: z.string(),
      icon: z.string().optional(),
    })).optional(),
    beforeAfter: z.object({
      before: z.string(),
      after: z.string(),
    }).optional(),
  }),
});

export const collections = {
  projects,
  'case-studies': caseStudies,
};
