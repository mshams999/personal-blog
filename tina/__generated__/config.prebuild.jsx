// tina/config.js
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "public/uploads",
      publicFolder: "public"
    }
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
        path: "public/content/posts",
        format: "mdx",
        defaultItem: () => {
          return {
            title: "New Blog Post",
            excerpt: "A brief description of this post...",
            date: (/* @__PURE__ */ new Date()).toISOString(),
            readTime: 5,
            featuredImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop&crop=center",
            authorId: "author-1",
            categoryId: "cat-1",
            tags: ["new"]
          };
        },
        ui: {
          router: ({ document }) => `/post/${document._sys.filename}`,
          filename: {
            readonly: false,
            slugify: (values) => {
              const slug = values?.title?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
              return `post-${Date.now()}-${slug}`;
            }
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
            ui: {
              description: "The main title of your blog post"
            }
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            required: true,
            ui: {
              component: "textarea",
              description: "A brief description that appears on the homepage and in social shares"
            }
          },
          {
            type: "datetime",
            name: "date",
            label: "Publication Date",
            required: true,
            ui: {
              description: "When this post was published"
            }
          },
          {
            type: "number",
            name: "readTime",
            label: "Read Time (minutes)",
            required: true,
            ui: {
              description: "Estimated reading time in minutes"
            }
          },
          {
            type: "image",
            name: "featuredImage",
            label: "Featured Image",
            required: true,
            ui: {
              description: "The hero image for this post"
            }
          },
          {
            type: "string",
            name: "authorId",
            label: "Author",
            required: true,
            options: [
              {
                value: "author-1",
                label: "Mohamed Shams Abdelaziz"
              }
            ],
            ui: {
              description: "Who wrote this post"
            }
          },
          {
            type: "string",
            name: "categoryId",
            label: "Category",
            required: true,
            options: [
              { value: "cat-1", label: "Inspiration" },
              { value: "cat-2", label: "Design" },
              { value: "cat-3", label: "Business" },
              { value: "cat-4", label: "Lifestyle" },
              { value: "cat-5", label: "Technology" },
              { value: "cat-6", label: "Health" },
              { value: "cat-7", label: "Travel" },
              { value: "cat-8", label: "Education" }
            ],
            ui: {
              description: "Which category this post belongs to"
            }
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            ui: {
              description: "Tags help readers find related content",
              component: "tags"
            }
          },
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            ui: {
              description: "The URL-friendly version of the title (auto-generated if left empty)"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true,
            templates: [
              {
                name: "Callout",
                label: "Callout",
                fields: [
                  {
                    type: "string",
                    name: "type",
                    label: "Type",
                    options: ["info", "warning", "error", "success"]
                  },
                  {
                    type: "string",
                    name: "title",
                    label: "Title"
                  },
                  {
                    type: "rich-text",
                    name: "content",
                    label: "Content"
                  }
                ]
              },
              {
                name: "CodeBlock",
                label: "Code Block",
                fields: [
                  {
                    type: "string",
                    name: "language",
                    label: "Language",
                    options: ["javascript", "typescript", "python", "bash", "css", "html", "json"]
                  },
                  {
                    type: "string",
                    name: "code",
                    label: "Code",
                    ui: {
                      component: "textarea"
                    }
                  }
                ]
              },
              {
                name: "ImageGallery",
                label: "Image Gallery",
                fields: [
                  {
                    type: "object",
                    name: "images",
                    label: "Images",
                    list: true,
                    fields: [
                      {
                        type: "image",
                        name: "src",
                        label: "Image"
                      },
                      {
                        type: "string",
                        name: "alt",
                        label: "Alt Text"
                      },
                      {
                        type: "string",
                        name: "caption",
                        label: "Caption"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          // SEO Fields
          {
            type: "object",
            name: "seo",
            label: "SEO Settings",
            fields: [
              {
                type: "string",
                name: "metaTitle",
                label: "Meta Title",
                ui: {
                  description: "Title for search engines (leave empty to use post title)"
                }
              },
              {
                type: "string",
                name: "metaDescription",
                label: "Meta Description",
                ui: {
                  component: "textarea",
                  description: "Description for search engines (leave empty to use excerpt)"
                }
              },
              {
                type: "string",
                name: "keywords",
                label: "Keywords",
                list: true,
                ui: {
                  description: "SEO keywords for this post"
                }
              }
            ]
          }
        ]
      },
      {
        name: "page",
        label: "Pages",
        path: "public/content/pages",
        format: "mdx",
        ui: {
          router: ({ document }) => `/${document._sys.filename}`
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true
          }
        ]
      },
      {
        name: "author",
        label: "Authors",
        path: "src/data/authors",
        format: "json",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            isTitle: true,
            required: true
          },
          {
            type: "image",
            name: "avatar",
            label: "Avatar"
          },
          {
            type: "string",
            name: "bio",
            label: "Bio",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "object",
            name: "social",
            label: "Social Links",
            fields: [
              {
                type: "string",
                name: "twitter",
                label: "Twitter"
              },
              {
                type: "string",
                name: "github",
                label: "GitHub"
              },
              {
                type: "string",
                name: "linkedin",
                label: "LinkedIn"
              },
              {
                type: "string",
                name: "email",
                label: "Email"
              }
            ]
          }
        ]
      },
      {
        name: "settings",
        label: "Site Settings",
        path: "src/data",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        match: {
          include: "info"
        },
        fields: [
          {
            type: "object",
            name: "siteMetadata",
            label: "Site Metadata",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Site Title"
              },
              {
                type: "string",
                name: "description",
                label: "Site Description",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "object",
                name: "author",
                label: "Default Author",
                fields: [
                  {
                    type: "string",
                    name: "name",
                    label: "Name"
                  },
                  {
                    type: "string",
                    name: "summary",
                    label: "Summary"
                  }
                ]
              },
              {
                type: "object",
                name: "social",
                label: "Social Media",
                fields: [
                  {
                    type: "string",
                    name: "twitter",
                    label: "Twitter Username"
                  },
                  {
                    type: "string",
                    name: "instagram",
                    label: "Instagram Username"
                  },
                  {
                    type: "string",
                    name: "facebook",
                    label: "Facebook Username"
                  },
                  {
                    type: "string",
                    name: "github",
                    label: "GitHub Username"
                  }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "navigation",
            label: "Navigation",
            list: true,
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name"
              },
              {
                type: "string",
                name: "href",
                label: "Link"
              }
            ]
          },
          {
            type: "object",
            name: "authors",
            label: "Authors",
            list: true,
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID"
              },
              {
                type: "string",
                name: "name",
                label: "Name"
              },
              {
                type: "string",
                name: "avatar",
                label: "Avatar URL"
              },
              {
                type: "string",
                name: "bio",
                label: "Bio",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "object",
                name: "social",
                label: "Social Links",
                fields: [
                  {
                    type: "string",
                    name: "github",
                    label: "GitHub"
                  },
                  {
                    type: "string",
                    name: "linkedin",
                    label: "LinkedIn"
                  },
                  {
                    type: "string",
                    name: "twitter",
                    label: "Twitter"
                  },
                  {
                    type: "string",
                    name: "facebook",
                    label: "Facebook"
                  },
                  {
                    type: "string",
                    name: "email",
                    label: "Email"
                  }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "categories",
            label: "Categories",
            list: true,
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID"
              },
              {
                type: "string",
                name: "name",
                label: "Name"
              },
              {
                type: "string",
                name: "slug",
                label: "Slug"
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
